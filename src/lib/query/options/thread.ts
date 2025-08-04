import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  getThreadComments,
  getThreadPost,
  getThreadPosts,
} from "@/services/thread";

// thread
export const threadOptions = queryOptions({
  queryKey: ["thread"],
});

export const threadPostOptions = (id: string) => {
  return queryOptions({
    queryKey: [...threadOptions.queryKey, id],
    queryFn: () => getThreadPost(id),
  });
};

export const threadInfiniteOptions = infiniteQueryOptions({
  queryKey: ["infiniteThread"],
  initialPageParam: undefined,
  queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
    getThreadPosts({ lastId: pageParam }),
  getNextPageParam: (posts) => {
    if (posts.length === 0) return undefined;

    return posts[posts.length - 1].id;
  },
});

export const threadSearchInfiniteOptions = (search: string) => {
  return infiniteQueryOptions({
    queryKey: [...threadInfiniteOptions.queryKey, "search", search],
    enabled: Boolean(search),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (!search) return [];

      return await getThreadPosts({
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

// thread comments
export const threadPostCommentsInfiniteOptions = (threadId: string) => {
  return infiniteQueryOptions({
    queryKey: [...threadOptions.queryKey, threadId, "comments"],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      getThreadComments({ id: threadId, lastId: pageParam }),
    getNextPageParam: (comments) => {
      if (comments.length === 0) return undefined;

      return comments[comments.length - 1].id;
    },
  });
};
