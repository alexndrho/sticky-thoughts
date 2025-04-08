import type { User } from "@prisma/client";
import ServerError from "@/utils/error/ServerError";

export const getSettingsInfo = async (): Promise<User> => {
  const res = await fetch("/api/user");

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError("User fetch error", data);
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
    throw new ServerError("Profile picture upload error", data);
  }

  return data;
};

export const removeProfilePicture = async (): Promise<{ message: string }> => {
  const res = await fetch("/api/user/profile-picture", {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError("Profile picture delete error", data);
  }

  return data;
};

export const updateName = async (
  name: string,
): Promise<{ message: string }> => {
  const res = await fetch("/api/user", {
    method: "PUT",
    body: JSON.stringify({ name }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError("Name update error", data);
  }

  return data;
};

export const updateUsername = async (
  username: string,
): Promise<{ message: string }> => {
  const res = await fetch("/api/user", {
    method: "PUT",
    body: JSON.stringify({ username }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError("Username update error", data);
  }

  return data;
};
