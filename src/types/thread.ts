import { type Prisma } from "@/generated/prisma/client";

export type BaseThreadPostType = Prisma.ThreadGetPayload<{
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
        comments: true;
      };
    };
  };
}>;

export type ThreadPostType = Omit<BaseThreadPostType, "likes" | "_count"> & {
  likes: {
    liked: boolean;
    count: number;
  };
  comments: {
    count: number;
  };
};

export type BaseThreadPostCommentType = Prisma.ThreadCommentGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        username: true;
        image: true;
      };
    };
  };
}>;

export type ThreadPostCommentType = Omit<
  BaseThreadPostCommentType,
  "likes" | "_count"
> & {
  likes: {
    liked: boolean;
    count: number;
  };
};
