"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { Box, Button, Flex, Input, Kbd } from "@mantine/core";
import { IconMessage, IconSearch } from "@tabler/icons-react";

import { authClient } from "@/lib/auth-client";
import {
  threadInfiniteOptions,
  threadSearchInfiniteOptions,
} from "@/app/(core)/threads/options";
import SignInWarningModal from "@/components/SignInWarningModal";
import ThreadItem from "./ThreadItem";
import { ThreadsSkeleton } from "./ThreadsSkeleton";
import { likeThread, unlikeThread } from "@/services/thread";
import { useIsNearScrollEnd } from "@/hooks/use-is-near-scroll-end";
import { setLikeThreadQueryData } from "@/app/(core)/threads/set-query-data";

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
        await likeThread(id);
      } else {
        await unlikeThread(id);
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
    <Box my="md" w="100%">
      <Flex w="100%" mb="md" gap="md">
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
          Submit a thread
        </Button>
      </Flex>

      <Flex direction="column" gap="md">
        {searchBarValue
          ? searchPostsData
            ? searchPostsData.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ThreadItem key={post.id} post={post} onLike={handleLike} />
                ))
            : isFetchingSearchPosts && <ThreadsSkeleton />
          : postsData
            ? postsData.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ThreadItem key={post.id} post={post} onLike={handleLike} />
                ))
            : isFetchingPosts && <ThreadsSkeleton />}

        {(isFetchingPosts || isFetchingSearchPosts) && <ThreadsSkeleton />}
      </Flex>

      {!session && (
        <SignInWarningModal
          opened={signInWarningModalOpened}
          onClose={signInWarningModalHandler.close}
        />
      )}
    </Box>
  );
}
