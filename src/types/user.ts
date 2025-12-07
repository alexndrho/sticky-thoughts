import { Prisma } from "@/generated/prisma/client";

export type UserProfile = Prisma.UserGetPayload<{
  select: {
    bio: true;
  };
}>;
