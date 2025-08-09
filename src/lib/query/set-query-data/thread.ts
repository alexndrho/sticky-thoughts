import { type InfiniteData } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";
import {
  userThreadsInfiniteOptions,
  userOptions,
  userLikedThreadsInfiniteOptions,
} from "../options/user";
import {
  threadInfiniteOptions,
  threadPostCommentsInfiniteOptions,
  threadPostOptions,
} from "@/lib/query/options/thread";
import type { ThreadPostType, ThreadPostCommentType } from "@/types/thread";

export const setLikeThreadQueryData = ({
  username, // optional, used for user-specific queries
  threadId,
  like,
}: {
  username?: string;
  threadId: string;
  like: boolean;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<ThreadPostType>(
    threadPostOptions(threadId).queryKey,
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
          } satisfies ThreadPostType)
        : oldData,
  );

  queryClient.setQueryData<InfiniteData<ThreadPostType[]>>(
    threadInfiniteOptions.queryKey,
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) =>
          page.map((post) =>
            post.id === threadId
              ? ({
                  ...post,
                  likes: {
                    ...post.likes,
                    liked: like,
                    count: like ? post.likes.count + 1 : post.likes.count - 1,
                  },
                } satisfies ThreadPostType)
              : post,
          ),
        ),
      };
    },
  );

  if (username) {
    queryClient.setQueryData<InfiniteData<ThreadPostType[]>>(
      userThreadsInfiniteOptions(username).queryKey,
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === threadId
                ? ({
                    ...post,
                    likes: {
                      ...post.likes,
                      liked: like,
                      count: like ? post.likes.count + 1 : post.likes.count - 1,
                    },
                  } satisfies ThreadPostType)
                : post,
            ),
          ),
        };
      },
    );

    queryClient.setQueryData<InfiniteData<ThreadPostType[]>>(
      userLikedThreadsInfiniteOptions(username).queryKey,
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            page.map((post) =>
              post.id === threadId
                ? ({
                    ...post,
                    likes: {
                      ...post.likes,
                      liked: like,
                      count: like ? post.likes.count + 1 : post.likes.count - 1,
                    },
                  } satisfies ThreadPostType)
                : post,
            ),
          ),
        };
      },
    );

    queryClient.invalidateQueries({
      queryKey: userThreadsInfiniteOptions(username).queryKey,
      refetchType: "none",
    });

    queryClient.invalidateQueries({
      queryKey: userLikedThreadsInfiniteOptions(username).queryKey,
      refetchType: "none",
    });
  } else {
    queryClient.invalidateQueries({
      queryKey: userOptions.queryKey,
    });
  }

  queryClient.invalidateQueries({
    queryKey: threadPostOptions(threadId).queryKey,
    refetchType: "none",
  });

  queryClient.invalidateQueries({
    queryKey: threadInfiniteOptions.queryKey,
    refetchType: "none",
  });
};

export const setCreateThreadPostCommentQueryData = ({
  id,
  comment,
}: {
  id: string;
  comment: ThreadPostCommentType;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<InfiniteData<ThreadPostCommentType[]>>(
    threadPostCommentsInfiniteOptions(id).queryKey,
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: [
          [
            {
              ...comment,
            } satisfies ThreadPostCommentType,
          ],
          ...oldData.pages,
        ],
      };
    },
  );

  queryClient.setQueryData<ThreadPostType>(
    threadPostOptions(id).queryKey,
    (oldData) =>
      oldData
        ? ({
            ...oldData,
            comments: {
              ...oldData.comments,
              count: oldData.comments.count + 1,
            },
          } satisfies ThreadPostType)
        : oldData,
  );

  queryClient.setQueryData<InfiniteData<ThreadPostType[]>>(
    threadInfiniteOptions.queryKey,
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
                } satisfies ThreadPostType)
              : post,
          ),
        ),
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: threadPostCommentsInfiniteOptions(id).queryKey,
    refetchType: "none",
  });

  queryClient.invalidateQueries({
    queryKey: threadPostOptions(id).queryKey,
    refetchType: "none",
  });

  queryClient.invalidateQueries({
    queryKey: threadInfiniteOptions.queryKey,
    refetchType: "none",
  });

  queryClient.invalidateQueries({
    queryKey: userOptions.queryKey,
  });
};

export const setUpdateThreadPostCommentQueryData = ({
  threadId,
  commentId,
  comment,
}: {
  threadId: string;
  commentId: string;
  comment: ThreadPostCommentType;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<InfiniteData<ThreadPostCommentType[]>>(
    threadPostCommentsInfiniteOptions(threadId).queryKey,
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
                } satisfies ThreadPostCommentType)
              : cmt,
          ),
        ),
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: threadPostCommentsInfiniteOptions(threadId).queryKey,
    refetchType: "none",
  });
};

export const setDeleteThreadPostCommentQueryData = ({
  threadId,
  commentId,
}: {
  threadId: string;
  commentId: string;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<InfiniteData<ThreadPostCommentType[]>>(
    threadPostCommentsInfiniteOptions(threadId).queryKey,
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
    queryKey: threadPostCommentsInfiniteOptions(threadId).queryKey,
    refetchType: "none",
  });
};

// comment like
export const setLikeThreadPostCommentQueryData = ({
  threadId,
  commentId,
  like,
}: {
  threadId: string;
  commentId: string;
  like: boolean;
}) => {
  const queryClient = getQueryClient();

  queryClient.setQueryData<InfiniteData<ThreadPostCommentType[]>>(
    threadPostCommentsInfiniteOptions(threadId).queryKey,
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
                } satisfies ThreadPostCommentType)
              : comment,
          ),
        ),
      };
    },
  );

  queryClient.invalidateQueries({
    queryKey: threadPostCommentsInfiniteOptions(threadId).queryKey,
    refetchType: "none",
  });
};
