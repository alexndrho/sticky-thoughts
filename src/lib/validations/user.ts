import { z } from "zod";
import type { Prisma } from "@prisma/client";

export const createUserInput = z.object({
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
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long"),
}) satisfies z.Schema<Prisma.UserCreateInput>;

export const userLoginInput = z.object({
  username: z.string({ required_error: "Username is required" }).min(3),
  password: z.string({ required_error: "Password is required" }).min(8),
});
