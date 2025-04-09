import { z } from "zod";

export const createForumInput = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters long"),
  body: z
    .string({ required_error: "Body is required" })
    .trim()
    .min(1, "Body is required")
    .max(20000, "Body must be at most 20,000 characters long"),
});
