"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouncedState } from "@mantine/hooks";
import { Box, Button, Flex, Input, Kbd, Skeleton } from "@mantine/core";
import { IconMessage, IconSearch } from "@tabler/icons-react";

import {
  forumInfiniteOptions,
  forumSearchInfiniteOptions,
} from "@/lib/query-options/forum";
import ForumPostItem from "@/components/ForumPostItem";

export default function ForumPage() {
  const [searchBarValue, setSearchBarValue] = useDebouncedState("", 250);

  const queryPosts = useInfiniteQuery(forumInfiniteOptions);
  const querySearchPosts = useInfiniteQuery(
    forumSearchInfiniteOptions(searchBarValue),
  );

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
          ? querySearchPosts.data
            ? querySearchPosts.data?.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => <ForumPostItem key={post.id} post={post} />)
            : querySearchPosts.isFetching && <PostsSkeleton />
          : queryPosts.data
            ? queryPosts.data?.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => <ForumPostItem key={post.id} post={post} />)
            : queryPosts.isFetching && <PostsSkeleton />}
      </Flex>
    </Box>
  );
}

export const PostsSkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} height={200} radius="lg" visible={true} />
      ))}
    </>
  );
};
