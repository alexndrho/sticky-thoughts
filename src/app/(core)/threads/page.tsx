"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { Box, Button, Flex, Group, Input, Kbd, Loader } from "@mantine/core";
import { IconMessage, IconSearch } from "@tabler/icons-react";

import { authClient } from "@/lib/auth-client";
import {
  threadInfiniteOptions,
  threadSearchInfiniteOptions,
} from "@/lib/query/options/thread";
import SignInWarningModal from "@/components/SignInWarningModal";
import ThreadPostItem from "./ThreadPostItem";
import { ThreadPostsSkeleton } from "./ThreadPostsSkeleton";
import { likeThreadPost, unlikeThreadPost } from "@/services/thread";
import { useIsNearScrollEnd } from "@/hooks/use-is-near-scroll-end";
import { setLikeThreadQueryData } from "@/lib/query/set-query-data/thread";

export default function ThreadPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [searchBarValue, setSearchBarValue] = useDebouncedState("", 250);
  const isNearScrollEnd = useIsNearScrollEnd();
  const [signInWarningModalOpened, signInWarningModalHandler] =
    useDisclosure(false);

  const {
    data: postsData,
    isFetching: isFetchingPosts,
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasNextPostsPage,
  } = useInfiniteQuery(threadInfiniteOptions);
  const {
    data: searchPostsData,
    isFetching: isFetchingSearchPosts,
    fetchNextPage: fetchNextSearchPostsPage,
    hasNextPage: hasNextSearchPostsPage,
  } = useInfiniteQuery(threadSearchInfiniteOptions(searchBarValue));

  useEffect(() => {
    if (isFetchingPosts || isFetchingSearchPosts) return;

    if (!isNearScrollEnd) return;

    if (searchBarValue) {
      if (hasNextSearchPostsPage) {
        fetchNextSearchPostsPage();
      }
    } else {
      if (hasNextPostsPage) {
        fetchNextPostsPage();
      }
    }
  }, [
    isNearScrollEnd,
    isFetchingPosts,
    isFetchingSearchPosts,
    hasNextPostsPage,
    hasNextSearchPostsPage,
    fetchNextPostsPage,
    fetchNextSearchPostsPage,
    searchBarValue,
  ]);

  const handleClickSubmitPost = () => {
    if (!session) {
      signInWarningModalHandler.open();
      return;
    }

    router.push("/threads/submit");
  };

  const handleLikeMutation = useMutation({
    mutationFn: async ({ id, like }: { id: string; like: boolean }) => {
      if (like) {
        await likeThreadPost(id);
      } else {
        await unlikeThreadPost(id);
      }

      return { threadId: id, like };
    },

    onSuccess: (data) => {
      setLikeThreadQueryData(data);
    },
  });

  const handleLike = ({ id, like }: { id: string; like: boolean }) => {
    if (!session) {
      signInWarningModalHandler.open();
      return;
    }

    handleLikeMutation.mutate({ id, like });
  };

  return (
    <Box my="lg" w="100%">
      <Flex w="100%" mb="lg" gap="md">
        <Input
          flex={1}
          placeholder="Search posts"
          leftSection={<IconSearch size="1rem" />}
          rightSection={<Kbd>t</Kbd>}
          onChange={(e) => setSearchBarValue(e.currentTarget.value)}
        />

        <Button
          rightSection={<IconMessage size="1em" />}
          onClick={handleClickSubmitPost}
        >
          Submit a post
        </Button>
      </Flex>

      <Flex direction="column" gap="lg">
        {searchBarValue
          ? searchPostsData
            ? searchPostsData.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ThreadPostItem
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                  />
                ))
            : isFetchingSearchPosts && <ThreadPostsSkeleton />
          : postsData
            ? postsData.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ThreadPostItem
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                  />
                ))
            : isFetchingPosts && <ThreadPostsSkeleton />}
      </Flex>

      <Group my="xl" h="2.25rem" justify="center">
        {(isFetchingPosts || isFetchingSearchPosts) && <Loader />}
      </Group>

      {!session && (
        <SignInWarningModal
          opened={signInWarningModalOpened}
          onClose={signInWarningModalHandler.close}
        />
      )}
    </Box>
  );
}
