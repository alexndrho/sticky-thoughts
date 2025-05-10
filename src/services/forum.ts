import type { Prisma } from "@prisma/client";

import { toServerError } from "@/utils/error/ServerError";

export type ForumPostType = Prisma.ForumGetPayload<{
  include: {
    author: {
      select: {
        name: true;
        image: true;
      };
    };
  };
}>;

export const submitForumPost = async (
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
    throw toServerError("Failed to submit forum post", dataResponse.errors);
  }

  return dataResponse;
};

export const getForumPost = async (id: string): Promise<ForumPostType> => {
  const response = await fetch(`/api/forum/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to get forum post", dataResponse.errors);
  }

  return dataResponse;
};

export const getForumPosts = async (): Promise<ForumPostType[]> => {
  const response = await fetch("/api/forum", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to get forum posts", dataResponse.errors);
  }

  return dataResponse;
};

export const updateForumPost = async ({
  id,
  body,
}: {
  id: string;
  body: Prisma.ForumUpdateInput["body"];
}): Promise<ForumPostType> => {
  const response = await fetch(`/api/forum/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: body,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to update forum post", data.errors);
  }

  return data;
};

export const deleteForumPost = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/forum/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to delete forum post", data.errors);
  }

  return data;
};
