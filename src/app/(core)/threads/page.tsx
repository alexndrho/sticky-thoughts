"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useDebouncedState, useDisclosure, useHotkeys } from "@mantine/hooks";
import { Box, Button, Flex, Input, Kbd } from "@mantine/core";
import { IconMessage, IconSearch } from "@tabler/icons-react";

import { authClient } from "@/lib/auth-client";
import {
  threadInfiniteOptions,
  threadSearchInfiniteOptions,
} from "@/app/(core)/threads/options";
import InfiniteScroll from "@/components/InfiniteScroll";
import SignInWarningModal from "@/components/SignInWarningModal";
import ThreadItem from "./ThreadItem";
import { ThreadsSkeleton } from "./ThreadsSkeleton";
import { likeThread, unlikeThread } from "@/services/thread";
import { setLikeThreadQueryData } from "@/app/(core)/threads/set-query-data";

export default function ThreadPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [searchBarValue, setSearchBarValue] = useDebouncedState("", 250);
  const [signInWarningModalOpened, signInWarningModalHandler] =
    useDisclosure(false);
  const searchRef = useRef<HTMLInputElement>(null);

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

  const focusSearchBar = () => {
    searchRef.current?.focus();
  };

  useHotkeys([["t", focusSearchBar]]);

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
          ref={searchRef}
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

      <InfiniteScroll
        onLoadMore={() => {
          if (searchBarValue.length > 0) {
            fetchNextSearchPostsPage();
          } else {
            fetchNextPostsPage();
          }
        }}
        hasNext={
          searchBarValue.length > 0 ? hasNextSearchPostsPage : hasNextPostsPage
        }
        loading={isFetchingPosts || isFetchingSearchPosts}
      >
        <Flex direction="column" gap="md">
          {searchBarValue
            ? searchPostsData?.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ThreadItem key={post.id} post={post} onLike={handleLike} />
                ))
            : postsData?.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ThreadItem key={post.id} post={post} onLike={handleLike} />
                ))}

          {(isFetchingPosts || isFetchingSearchPosts) && <ThreadsSkeleton />}
        </Flex>
      </InfiniteScroll>

      {!session && (
        <SignInWarningModal
          opened={signInWarningModalOpened}
          onClose={signInWarningModalHandler.close}
        />
      )}
    </Box>
  );
}
