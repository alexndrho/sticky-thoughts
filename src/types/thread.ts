import { type Prisma } from "@/generated/prisma/client";

export type BaseThreadType = Prisma.ThreadGetPayload<{
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

export type ThreadType = Omit<BaseThreadType, "likes" | "_count"> & {
  likes: {
    liked: boolean;
    count: number;
  };
  comments: {
    count: number;
  };
};

export type BaseThreadCommentType = Prisma.ThreadCommentGetPayload<{
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

export type ThreadCommentType = Omit<
  BaseThreadCommentType,
  "likes" | "_count"
> & {
  likes: {
    liked: boolean;
    count: number;
  };
};
