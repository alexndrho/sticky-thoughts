import {
  Timestamp,
  addDoc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
} from "firebase/firestore";
import { thoughtsCollectionRef } from "@/lib/firebase";
import IThought, { IThoughtSubmit } from "@/types/thought";

const THOUGHTS_PER_ROW = 4;
const THOUGHTS_PER_PAGE = THOUGHTS_PER_ROW * 3;

const MAX_AUTHOR_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 250;

const fetchThoughts = async (lastPost?: Timestamp): Promise<IThought[]> => {
  let q = query(
    thoughtsCollectionRef,
    orderBy("createdAt", "desc"),
    limit(THOUGHTS_PER_PAGE),
  );

  if (lastPost) {
    q = query(q, startAfter(lastPost));
  }

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    ...(doc.data() as Omit<IThought, "id">),
    author: (doc.data() as Omit<IThought, "id">).author,
    message: (doc.data() as Omit<IThought, "id">).message,
    color: (doc.data() as Omit<IThought, "id">).color,
    id: doc.id,
  }));
};

const submitThought = async (
  thought: Omit<IThought, "id" | "lowerCaseAuthor" | "createdAt">,
) => {
  if (thought.author.length > MAX_AUTHOR_LENGTH) {
    throw new Error("Author is too long");
  } else if (thought.message.length > MAX_MESSAGE_LENGTH) {
    throw new Error("Message is too long");
  }

  const doc = await addDoc(thoughtsCollectionRef, {
    ...thought,
    lowerCaseAuthor: thought.author.toLowerCase(),
    createdAt: serverTimestamp(),
  } satisfies IThoughtSubmit);

  return doc;
};

const getThoughtsCount = async (): Promise<number> => {
  const snapshot = await getCountFromServer(thoughtsCollectionRef);
  return snapshot.data().count;
};

const searchThoughts = async (searchTerm: string): Promise<IThought[]> => {
  const searchString = searchTerm.toLowerCase();

  const firstLetter = searchString[0];
  let q = query(
    thoughtsCollectionRef,
    where("lowerCaseAuthor", ">=", searchString),
    limit(THOUGHTS_PER_PAGE),
  );

  if (firstLetter < "z") {
    const nextLetter = ((parseInt(firstLetter, 36) + 1) % 36).toString(36);
    q = query(q, where("lowerCaseAuthor", "<", nextLetter));
  }

  const results = await getDocs(q);

  return results.docs.map((doc) => ({
    ...(doc.data() as Omit<IThought, "id">),
    id: doc.id,
  }));
};

export {
  MAX_AUTHOR_LENGTH,
  MAX_MESSAGE_LENGTH,
  fetchThoughts,
  getThoughtsCount,
  submitThought,
  searchThoughts,
};
