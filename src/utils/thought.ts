import type { Thought } from "@prisma/client";

// Override date type to string
export type ThoughtFromServer = Omit<Thought, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

// Date data from the server HTTP response body is parsed as JSON,
// so date fields are strings and need to be converted to Date objects
export const convertThoughtDates = (thought: ThoughtFromServer): Thought => {
  return {
    ...thought,
    createdAt: new Date(thought.createdAt),
  } satisfies Thought;
};
