import type { Prisma } from "@prisma/client";

import { toServerError } from "@/utils/error/ServerError";
import type { ForumPostCommentType, ForumPostType } from "@/types/forum";

// forum
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

export const getForumPosts = async ({
  lastId,
  searchTerm,
}: {
  lastId?: string;
  searchTerm?: string;
}): Promise<ForumPostType[]> => {
  const params = new URLSearchParams();

  if (lastId) {
    params.append("lastId", lastId);
  }
  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }

  const response = await fetch(`/api/forum?${params}`, {
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

// forum like
export const likeForumPost = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/forum/${id}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to like forum post", data.errors);
  }

  return data;
};

export const unlikeForumPost = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/forum/${id}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to unlike forum post", data.errors);
  }

  return data;
};

// comment
export const submitForumPostComment = async ({
  id,
  body,
}: {
  id: string;
  body: Prisma.ForumCreateInput["body"];
}): Promise<ForumPostCommentType> => {
  const response = await fetch(`/api/forum/${id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body,
    }),
  });

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to submit comment", dataResponse.errors);
  }

  return dataResponse;
};

export const getForumComments = async ({
  id,
  lastId,
}: {
  id: string;
  lastId?: string;
}): Promise<ForumPostCommentType[]> => {
  const params = new URLSearchParams();

  if (lastId) {
    params.append("lastId", lastId);
  }

  const response = await fetch(`/api/forum/${id}/comments?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to get comments", dataResponse.errors);
  }

  return dataResponse;
};

export const deleteForumPostComment = async ({
  forumId,
  commentId,
}: {
  forumId: string;
  commentId: string;
}) => {
  const response = await fetch(`/api/forum/${forumId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to delete comment", dataResponse.errors);
  }

  return dataResponse;
};

// comment like
export const likeForumPostComment = async ({
  forumId,
  commentId,
}: {
  forumId: string;
  commentId: string;
}) => {
  const response = await fetch(
    `/api/forum/${forumId}/comments/${commentId}/like`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to like comment", dataResponse.errors);
  }

  return dataResponse;
};

export const unlikeForumPostComment = async ({
  forumId,
  commentId,
}: {
  forumId: string;
  commentId: string;
}) => {
  const response = await fetch(
    `/api/forum/${forumId}/comments/${commentId}/like`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to unlike comment", dataResponse.errors);
  }

  return dataResponse;
};
