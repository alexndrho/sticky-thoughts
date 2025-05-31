import { type InfiniteData } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";
import {
  forumInfiniteOptions,
  forumPostCommentsInfiniteOptions,
  forumPostOptions,
} from "@/lib/query/options/forum";
import type { ForumPostType, ForumPostCommentType } from "@/types/forum";

export const setLikeForumQueryData = ({
  id,
  like,
}: {
  id: string;
  like: boolean;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<ForumPostType>(
    forumPostOptions(id).queryKey,
    (oldData) =>
      oldData
        ? ({
            ...oldData,
            likes: {
              ...oldData.likes,
              liked: like,
              count: oldData.likes.liked
                ? oldData.likes.count - 1
                : oldData.likes.count + 1,
            },
          } satisfies ForumPostType)
        : oldData,
  );

  queryClient.setQueryData<InfiniteData<ForumPostType[]>>(
    forumInfiniteOptions.queryKey,
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((post) =>
            post.id === id
              ? ({
                  ...post,
                  likes: {
                    ...post.likes,
                    liked: like,
                    count: like ? post.likes.count + 1 : post.likes.count - 1,
                  },
                } satisfies ForumPostType)
              : post,
          ),
        ),
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: forumPostOptions(id).queryKey,
    refetchType: "none",
  });

  queryClient.invalidateQueries({
    queryKey: forumInfiniteOptions.queryKey,
    refetchType: "none",
  });
};

export const setCreateForumPostCommentQueryData = ({
  id,
  comment,
}: {
  id: string;
  comment: ForumPostCommentType;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<InfiniteData<ForumPostCommentType[]>>(
    forumPostCommentsInfiniteOptions(id).queryKey,
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: [
          [
            {
              ...comment,
            } satisfies ForumPostCommentType,
          ],
          ...oldData.pages,
        ],
      };
    },
  );

  queryClient.setQueryData<ForumPostType>(
    forumPostOptions(id).queryKey,
    (oldData) =>
      oldData
        ? ({
            ...oldData,
            comments: {
              ...oldData.comments,
              count: oldData.comments.count + 1,
            },
          } satisfies ForumPostType)
        : oldData,
  );

  queryClient.setQueryData<InfiniteData<ForumPostType[]>>(
    forumInfiniteOptions.queryKey,
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((post) =>
            post.id === id
              ? ({
                  ...post,
                  comments: {
                    ...post.comments,
                    count: post.comments.count + 1,
                  },
                } satisfies ForumPostType)
              : post,
          ),
        ),
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: forumPostCommentsInfiniteOptions(id).queryKey,
    refetchType: "none",
  });

  queryClient.invalidateQueries({
    queryKey: forumPostOptions(id).queryKey,
    refetchType: "none",
  });

  queryClient.invalidateQueries({
    queryKey: forumInfiniteOptions.queryKey,
    refetchType: "none",
  });
};

export const setUpdateForumPostCommentQueryData = ({
  forumId,
  commentId,
  comment,
}: {
  forumId: string;
  commentId: string;
  comment: ForumPostCommentType;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<InfiniteData<ForumPostCommentType[]>>(
    forumPostCommentsInfiniteOptions(forumId).queryKey,
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((cmt) =>
            cmt.id === commentId
              ? ({
                  ...cmt,
                  ...comment,
                } satisfies ForumPostCommentType)
              : cmt,
          ),
        ),
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: forumPostCommentsInfiniteOptions(forumId).queryKey,
    refetchType: "none",
  });
};

export const setDeleteForumPostCommentQueryData = ({
  forumId,
  commentId,
}: {
  forumId: string;
  commentId: string;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<InfiniteData<ForumPostCommentType[]>>(
    forumPostCommentsInfiniteOptions(forumId).queryKey,
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.filter((comment) => comment.id !== commentId),
        ),
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: forumPostCommentsInfiniteOptions(forumId).queryKey,
    refetchType: "none",
  });
};

// comment like
export const setLikeForumPostCommentQueryData = ({
  forumId,
  commentId,
  like,
}: {
  forumId: string;
  commentId: string;
  like: boolean;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<InfiniteData<ForumPostCommentType[]>>(
    forumPostCommentsInfiniteOptions(forumId).queryKey,
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((comment) =>
            comment.id === commentId
              ? ({
                  ...comment,
                  likes: {
                    ...comment.likes,
                    liked: like,
                    count: like
                      ? comment.likes.count + 1
                      : comment.likes.count - 1,
                  },
                } satisfies ForumPostCommentType)
              : comment,
          ),
        ),
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: forumPostCommentsInfiniteOptions(forumId).queryKey,
    refetchType: "none",
  });
};
