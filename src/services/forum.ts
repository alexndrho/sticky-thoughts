import { Prisma } from "@prisma/client";

export const submitForum = async (
  data: Omit<Prisma.ForumCreateInput, "author">,
): Promise<{ id: string }> => {
  const response = await fetch("/api/forum", {
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
