import { type Prisma } from "@prisma/client";

export type BaseForumPostType = Prisma.ForumGetPayload<{
  include: {
    author: {
      select: {
        name: true;
        username: true;
        image: true;
      };
    };
    likes?: {
      select: {
        userId: true;
      };
    };
    _count: {
      select: {
        likes: true;
      };
    };
  };
}>;

export type ForumPostType = Omit<BaseForumPostType, "likes" | "_count"> & {
  likes: {
    liked: boolean;
    count: number;
  };
};
