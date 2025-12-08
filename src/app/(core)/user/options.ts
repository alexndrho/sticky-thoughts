import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { getUser, getUserLikedThreads, getUserThreads } from "@/services/user";

export const userOptions = queryOptions({
  queryKey: ["user"],
});

export const userUsernameOptions = (username: string, cookie?: string) => {
  return queryOptions({
    queryKey: [...userOptions.queryKey, username],
    queryFn: () => getUser(username, cookie),
  });
};

export const userThreadsInfiniteOptions = (username: string) => {
  return infiniteQueryOptions({
    queryKey: [...userOptions.queryKey, username, "threads"],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      getUserThreads({
        username,
        lastId: pageParam,
      }),
    getNextPageParam: (posts) => {
      if (posts.length === 0) return undefined;

      return posts[posts.length - 1].id;
    },
  });
};

export const userLikedThreadsInfiniteOptions = (username: string) => {
  return infiniteQueryOptions({
    queryKey: [...userOptions.queryKey, username, "likes"],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      getUserLikedThreads({
        username,
        lastId: pageParam,
      }),
    getNextPageParam: (posts) => {
      if (posts.length === 0) return undefined;

      return posts[posts.length - 1].id;
    },
  });
};
