import { z } from "zod";

export const updateNameInput = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .max(50, "Name must be at most 50 characters long")
    .regex(
      /^$|^[a-zA-Z0-9_ ]+$/,
      "Name can only contain letters, numbers, underscores, and spaces",
    ),
});

export const updateUsernameInput = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
      /^$|^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .regex(
      /^$|^(?!.*__)(?!.*\.\.)(?!.*\._)(?!.*_\.)^(?!.*\._\.).*$/,
      "Username cannot contain consecutive underscores, dots, or invalid combinations like '._', '_.' or '._.'",
    )
    .regex(
      /^$|^(?!_)(?!.*_$).*$/,
      "Username cannot start or end with an underscore",
    ),
});

export const updateUserInput = updateNameInput
  .merge(updateUsernameInput)
  .partial();
