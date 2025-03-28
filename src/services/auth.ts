import ServerError from "@/utils/error/ServerError";

export const signup = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<{ message: string }> => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError("Signup failed", data);
  }

  return data;
};
