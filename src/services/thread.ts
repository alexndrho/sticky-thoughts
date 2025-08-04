import type { Prisma } from "@prisma/client";

import { toServerError } from "@/utils/error/ServerError";
import type { ThreadPostCommentType, ThreadPostType } from "@/types/thread";

// thread
export const submitThreadPost = async (
  data: Omit<Prisma.ThreadCreateInput, "author">,
): Promise<{ id: string }> => {
  const response = await fetch("/api/threads", {
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
    throw toServerError("Failed to submit thread post", dataResponse.errors);
  }

  return dataResponse;
};

export const getThreadPost = async (id: string): Promise<ThreadPostType> => {
  const response = await fetch(`/api/threads/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to get thread post", dataResponse.errors);
  }

  return dataResponse;
};

export const getThreadPosts = async ({
  lastId,
  searchTerm,
}: {
  lastId?: string;
  searchTerm?: string;
}): Promise<ThreadPostType[]> => {
  const params = new URLSearchParams();

  if (lastId) {
    params.append("lastId", lastId);
  }
  if (searchTerm) {
    params.append("searchTerm", searchTerm);
  }

  const response = await fetch(`/api/threads?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to get thread posts", dataResponse.errors);
  }

  return dataResponse;
};

export const updateThreadPost = async ({
  id,
  body,
}: {
  id: string;
  body: Prisma.ThreadUpdateInput["body"];
}): Promise<ThreadPostType> => {
  const response = await fetch(`/api/threads/${id}`, {
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
    throw toServerError("Failed to update thread post", data.errors);
  }

  return data;
};

export const deleteThreadPost = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/threads/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to delete thread post", data.errors);
  }

  return data;
};

// thread like
export const likeThreadPost = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/threads/${id}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to like thread post", data.errors);
  }

  return data;
};

export const unlikeThreadPost = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await fetch(`/api/threads/${id}/like`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to unlike thread post", data.errors);
  }

  return data;
};

// comment
export const submitThreadPostComment = async ({
  id,
  body,
}: {
  id: string;
  body: Prisma.ThreadCreateInput["body"];
}): Promise<ThreadPostCommentType> => {
  const response = await fetch(`/api/threads/${id}/comments`, {
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

export const getThreadComments = async ({
  id,
  lastId,
}: {
  id: string;
  lastId?: string;
}): Promise<ThreadPostCommentType[]> => {
  const params = new URLSearchParams();

  if (lastId) {
    params.append("lastId", lastId);
  }

  const response = await fetch(`/api/threads/${id}/comments?${params}`, {
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

export const updateThreadPostComment = async ({
  threadId,
  commentId,
  body,
}: {
  threadId: string;
  commentId: string;
  body: string;
}): Promise<ThreadPostCommentType> => {
  const response = await fetch(
    `/api/threads/${threadId}/comments/${commentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
      }),
    },
  );

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to update comment", dataResponse.errors);
  }

  return dataResponse;
};

export const deleteThreadPostComment = async ({
  threadId,
  commentId,
}: {
  threadId: string;
  commentId: string;
}) => {
  const response = await fetch(
    `/api/threads/${threadId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const dataResponse = await response.json();

  if (!response.ok) {
    throw toServerError("Failed to delete comment", dataResponse.errors);
  }

  return dataResponse;
};

// comment like
export const likeThreadPostComment = async ({
  threadId,
  commentId,
}: {
  threadId: string;
  commentId: string;
}) => {
  const response = await fetch(
    `/api/threads/${threadId}/comments/${commentId}/like`,
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

export const unlikeThreadPostComment = async ({
  threadId,
  commentId,
}: {
  threadId: string;
  commentId: string;
}) => {
  const response = await fetch(
    `/api/threads/${threadId}/comments/${commentId}/like`,
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
