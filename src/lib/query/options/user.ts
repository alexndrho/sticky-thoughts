import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { getUser, getUserThreads } from "@/services/user";
import { threadInfiniteOptions } from "./thread";

export const userOptions = queryOptions({
  queryKey: ["user"],
});

export const userUsernameOptions = (username: string) => {
  return queryOptions({
    queryKey: [...userOptions.queryKey, username],
    queryFn: () => getUser(username),
  });
};

export const userThreadsInfiniteOptions = (username: string) => {
  return infiniteQueryOptions({
    queryKey: [
      ...userOptions.queryKey,
      username,
      ...threadInfiniteOptions.queryKey,
    ],
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
