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
} from 'firebase/firestore';
import { thoughtsCollectionRef } from '../api/firebase';
import IThought, { IThoughtSubmit } from '../types/IThought';

const THOUGHTS_PER_ROW = 4;
const THOUGHTS_PER_PAGE = THOUGHTS_PER_ROW * 3;

const MAX_AUTHOR_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 250;

const fetchInitialThoughts = async (): Promise<IThought[]> => {
  const q = query(
    thoughtsCollectionRef,
    orderBy('createdAt', 'desc'),
    limit(THOUGHTS_PER_PAGE)
  );
  const querySnapshot = await getDocs(q);

  const thoughts: IThought[] = querySnapshot.docs.map((doc) => ({
    ...(doc.data() as Omit<IThought, 'id'>),
    id: doc.id,
  }));

  return thoughts;
};

const getMoreThoughts = async (lastPost: Timestamp): Promise<IThought[]> => {
  const q = query(
    thoughtsCollectionRef,
    orderBy('createdAt', 'desc'),
    startAfter(lastPost),
    limit(THOUGHTS_PER_PAGE)
  );

  const querySnapshot = await getDocs(q);

  const thoughts: IThought[] = querySnapshot.docs.map((doc) => ({
    ...(doc.data() as Omit<IThought, 'id'>),
    id: doc.id,
  }));

  return thoughts;
};

const submitThought = async (
  thought: Omit<IThought, 'id' | 'lowerCaseAuthor' | 'createdAt'>
) => {
  if (thought.author.length > MAX_AUTHOR_LENGTH) {
    throw new Error('Author is too long');
  } else if (thought.message.length > MAX_MESSAGE_LENGTH) {
    throw new Error('Message is too long');
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

export {
  MAX_AUTHOR_LENGTH,
  MAX_MESSAGE_LENGTH,
  fetchInitialThoughts,
  getMoreThoughts,
  getThoughtsCount,
  submitThought,
};
