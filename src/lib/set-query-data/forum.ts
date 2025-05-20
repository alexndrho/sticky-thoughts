import { type InfiniteData } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/get-query-client";
import {
  forumInfiniteOptions,
  forumPostOptions,
} from "@/lib/query-options/forum";
import type { ForumPostType } from "@/types/forum";

export const setForumQueryData = ({
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
        ? {
            ...oldData,
            likes: {
              ...oldData.likes,
              liked: like,
              count: oldData.likes.liked
                ? oldData.likes.count - 1
                : oldData.likes.count + 1,
            },
          }
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
              ? {
                  ...post,
                  likes: {
                    ...post.likes,
                    liked: like,
                    count: like ? post.likes.count + 1 : post.likes.count - 1,
                  },
                }
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
