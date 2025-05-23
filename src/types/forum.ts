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
        comments: true;
      };
    };
  };
}>;

export type ForumPostType = Omit<BaseForumPostType, "likes" | "_count"> & {
  likes: {
    liked: boolean;
    count: number;
  };
  comments: {
    count: number;
  };
};

export type BaseForumPostCommentType = Prisma.ForumCommentGetPayload<{
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

export type ForumPostCommentType = Omit<
  BaseForumPostCommentType,
  "likes" | "_count"
> & {
  likes: {
    liked: boolean;
    count: number;
  };
};
