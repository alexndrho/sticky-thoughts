import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { getThoughts, getThoughtsCount } from "@/services/thought";

// query options
export const thoughtOptions = queryOptions({
  queryKey: ["thoughts"],
});

export const thoughtCountOptions = queryOptions({
  queryKey: [...thoughtOptions.queryKey, "count"],
  queryFn: async () => {
    return await getThoughtsCount();
  },
});

// infinite query options
export const thoughtInfiniteOptions = infiniteQueryOptions({
  queryKey: ["infiniteThoughts"],
  initialPageParam: undefined,
  queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
    getThoughts({ lastId: pageParam }),
  getNextPageParam: (thoughts) => {
    if (thoughts.length === 0) return undefined;

    return thoughts[thoughts.length - 1].id;
  },
});

export const thoughtSearchInfiniteOptions = (search: string) => {
  return infiniteQueryOptions({
    queryKey: [
      ...thoughtInfiniteOptions.queryKey,
      "thoughts",
      "search",
      search,
    ],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (!search) return [];

      return getThoughts({ lastId: pageParam, searchTerm: search });
    },
    enabled: Boolean(search),
    getNextPageParam: (thoughts) => {
      if (thoughts.length === 0) return undefined;

      return thoughts[thoughts.length - 1].id;
    },
  });
};
