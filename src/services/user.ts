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
