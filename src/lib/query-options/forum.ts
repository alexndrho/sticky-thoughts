import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  getForumComments,
  getForumPost,
  getForumPosts,
} from "@/services/forum";

// forum
export const forumOptions = queryOptions({
  queryKey: ["forum"],
});

export const forumPostOptions = (id: string) => {
  return queryOptions({
    queryKey: [...forumOptions.queryKey, id],
    queryFn: () => getForumPost(id),
  });
};

export const forumInfiniteOptions = infiniteQueryOptions({
  queryKey: ["infiniteForum"],
  initialPageParam: undefined,
  queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
    getForumPosts({ lastId: pageParam }),
  getNextPageParam: (posts) => {
    if (posts.length === 0) return undefined;

    return posts[posts.length - 1].id;
  },
});

export const forumSearchInfiniteOptions = (search: string) => {
  return infiniteQueryOptions({
    queryKey: [...forumInfiniteOptions.queryKey, "search", search],
    enabled: Boolean(search),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (!search) return [];

      return await getForumPosts({
        lastId: pageParam,
        searchTerm: search,
      });
    },
    getNextPageParam: (posts) => {
      if (posts.length === 0) return undefined;

      return posts[posts.length - 1].id;
    },
  });
};

// forum comments
export const forumPostCommentsInfiniteOptions = (forumId: string) => {
  return infiniteQueryOptions({
    queryKey: [...forumOptions.queryKey, forumId, "comments"],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      getForumComments({ id: forumId, lastId: pageParam }),
    getNextPageParam: (comments) => {
      if (comments.length === 0) return undefined;

      return comments[comments.length - 1].id;
    },
  });
};
