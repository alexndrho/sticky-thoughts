import type { User } from "@prisma/client";

import { toServerError } from "@/utils/error/ServerError";
import type { ThreadPostType } from "@/types/thread";

export const getUser = async (username: string): Promise<User> => {
  const res = await fetch(`/api/user/${username}`);

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("User fetch error", data.errors);
  }

  return data;
};

export const uploadProfilePicture = async (
  formData: FormData,
): Promise<{ image: string }> => {
  const res = await fetch("/api/user/profile-picture", {
    method: "PUT",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("Profile picture upload error", data.errors);
  }

  return data;
};

export const removeProfilePicture = async (): Promise<{ message: string }> => {
  const res = await fetch("/api/user/profile-picture", {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("Profile picture delete error", data.errors);
  }

  return data;
};

export const getUserThreads = async ({
  username,
  lastId,
  searchTerm,
}: {
  username: string;
  lastId?: string;
  searchTerm?: string;
}): Promise<ThreadPostType[]> => {
  const searchParams = new URLSearchParams();

  if (lastId) {
    searchParams.append("lastId", lastId);
  }
  if (searchTerm) {
    searchParams.append("searchTerm", searchTerm);
  }

  const res = await fetch(`/api/user/${username}/threads?${searchParams}`);

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("User threads fetch error", data.errors);
  }

  return data;
};
