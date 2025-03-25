import type { Prisma, Thought } from "@prisma/client";

import { convertThoughtDates, ThoughtFromServer } from "@/utils/thought";

const getThoughts = async ({
  lastId,
  searchTerm,
}: {
  lastId?: string;
  searchTerm?: string;
}): Promise<Thought[]> => {
  const params = new URLSearchParams();

  if (lastId) {
    params.append("lastId", lastId);
  }

  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }

  const response = await fetch(
    `/api/thoughts${params.toString() ? `?${params.toString()}` : ""}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors[0].message);
  }

  return data.map(convertThoughtDates);
};

const submitThought = async (
  data: Prisma.ThoughtCreateInput,
): Promise<{ message: string }> => {
  const response = await fetch("/api/thoughts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
    }),
  });

  const dataResponse = await response.json();

  if (!response.ok) {
    console.log(dataResponse);

    throw new Error(dataResponse.errors[0].message);
  }

  return dataResponse;
};

const getThoughtsCount = async (): Promise<number> => {
  const response = await fetch("/api/thoughts/count");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors[0].message);
  }

  return data.count;
};

// const searchThoughts = async (searchTerm: string): Promise<Thought[]> => {
//   const response = await fetch(
//     `/api/thoughts?searchTerm=${encodeURIComponent(searchTerm)}`,
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.errors[0].message);
//   }

//   return data.map(convertThoughtDates);
// };

export { getThoughts, getThoughtsCount, submitThought };

export type { ThoughtFromServer };
