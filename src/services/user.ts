import { toServerError } from "@/utils/error/ServerError";
import { apiUrl } from "@/utils/text";
import type { UserProfileSettings, UserPublicProfile } from "@/types/user";
import type { ThreadType } from "@/types/thread";

export const getUser = async (
  username: string,
  cookie?: string,
): Promise<UserPublicProfile> => {
  const res = await fetch(apiUrl(`/api/user/${username}`), {
    headers: {
      ...(cookie ? { cookie } : {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("User fetch error", data.issues);
  }

  return data;
};

export const getUserProfileSettings =
  async (): Promise<UserProfileSettings> => {
    const res = await fetch(apiUrl("/api/user/settings"));

    const data = await res.json();

    if (!res.ok) {
      throw toServerError("User profile fetch error", data.issues);
    }

    return data;
  };

export const updateUserBio = async (bio: string): Promise<{ bio: string }> => {
  const res = await fetch(apiUrl("/api/user/bio"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bio }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("User bio update error", data.issues);
  }

  return data;
};

export const uploadProfilePicture = async (
  formData: FormData,
): Promise<{ image: string }> => {
  const res = await fetch(apiUrl("/api/user/profile-picture"), {
    method: "PUT",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("Profile picture upload error", data.issues);
  }

  return data;
};

export const removeProfilePicture = async (): Promise<{ message: string }> => {
  const res = await fetch(apiUrl("/api/user/profile-picture"), {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("Profile picture delete error", data.issues);
  }

  return data;
};

// profile

export const getUserThreads = async ({
  username,
  lastId,
}: {
  username: string;
  lastId?: string;
}): Promise<ThreadType[]> => {
  const searchParams = new URLSearchParams();

  if (lastId) {
    searchParams.append("lastId", lastId);
  }

  const res = await fetch(
    apiUrl(`/api/user/${username}/threads?${searchParams}`),
  );

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("User threads fetch error", data.issues);
  }

  return data;
};

export const getUserLikedThreads = async ({
  username,
  lastId,
}: {
  username: string;
  lastId?: string;
}): Promise<ThreadType[]> => {
  const searchParams = new URLSearchParams();

  if (lastId) {
    searchParams.append("lastId", lastId);
  }

  const res = await fetch(
    apiUrl(`/api/user/${username}/likes?${searchParams}`),
  );

  const data = await res.json();

  if (!res.ok) {
    throw toServerError("User liked threads fetch error", data.issues);
  }

  return data;
};
