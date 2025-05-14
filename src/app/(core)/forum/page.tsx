"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDebouncedState } from "@mantine/hooks";
import { Box, Button, Flex, Input, Kbd, Skeleton } from "@mantine/core";
import { IconMessage, IconSearch } from "@tabler/icons-react";

import ForumPostItem from "@/components/ForumPostItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getForumPosts } from "@/services/forum";

export default function ForumPage() {
  const [searchBarValue, setSearchBarValue] = useDebouncedState("", 250);

  const queryPosts = useInfiniteQuery({
    queryKey: ["posts"],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) =>
      getForumPosts({ lastId: pageParam }),
    getNextPageParam: (posts) => {
      if (posts.length === 0) return undefined;

      return posts[posts.length - 1].id;
    },
  });

  const querySearchPosts = useInfiniteQuery({
    queryKey: ["posts", "search", searchBarValue],
    enabled: Boolean(searchBarValue),
    initialPageParam: undefined,
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (!searchBarValue) return [];

      return await getForumPosts({
        lastId: pageParam,
        searchTerm: searchBarValue,
      });
    },
    getNextPageParam: (posts) => {
      if (posts.length === 0) return undefined;

      return posts[posts.length - 1].id;
    },
  });

  useEffect(() => {
    function handleScroll() {
      if (queryPosts.isFetching || querySearchPosts.isFetching) return;

      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500;

      if (!isNearBottom) return;

      if (searchBarValue) {
        if (querySearchPosts.hasNextPage) {
          querySearchPosts.fetchNextPage();
        }
      } else {
        if (queryPosts.hasNextPage) {
          queryPosts.fetchNextPage();
        }
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [queryPosts, querySearchPosts, searchBarValue]);

  return (
    <Box my="xl" w="100%">
      <Flex w="100%" mb="md" gap="md">
        <Input
          flex={1}
          placeholder="Search posts"
          leftSection={<IconSearch size="1rem" />}
          rightSection={<Kbd>t</Kbd>}
          onChange={(e) => setSearchBarValue(e.currentTarget.value)}
        />

        <Button
          component={Link}
          href="/forum/submit"
          rightSection={<IconMessage size="1em" />}
        >
          Submit a post
        </Button>
      </Flex>

      <Flex direction="column" gap="md">
        {searchBarValue
          ? !querySearchPosts.isFetching
            ? querySearchPosts.data?.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ForumPostItem
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    body={post.body}
                    author={{
                      name: post.author.name,
                      image: post.author.image,
                    }}
                  />
                ))
            : Array.from({ length: 5 }, (_, i) => (
                <Skeleton
                  key={i}
                  height={200}
                  radius="lg"
                  visible={true}
                  mb="md"
                />
              ))
          : !queryPosts.isFetching
            ? queryPosts.data?.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ForumPostItem
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    body={post.body}
                    author={{
                      name: post.author.name,
                      image: post.author.image,
                    }}
                  />
                ))
            : Array.from({ length: 5 }, (_, i) => (
                <Skeleton
                  key={i}
                  height={200}
                  radius="lg"
                  visible={true}
                  mb="md"
                />
              ))}
      </Flex>
    </Box>
  );
}
