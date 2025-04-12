import { toServerError } from "@/utils/error/ServerError";

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
