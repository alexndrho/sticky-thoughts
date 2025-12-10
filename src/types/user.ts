import { Prisma } from "@/generated/prisma/client";

export type UserPublicProfile = Prisma.UserGetPayload<{
  select: {
    id: true;
    displayUsername: true;
    name: true;
    username: true;
    bio: true;
    image: true;
  };
}>;

export type UserProfileSettings = Prisma.UserGetPayload<{
  select: {
    bio: true;
  };
}>;
