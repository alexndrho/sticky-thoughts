"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { Box, Button, Flex, Input, Kbd } from "@mantine/core";
import { IconMessage, IconSearch } from "@tabler/icons-react";

import { authClient } from "@/lib/auth-client";
import {
  forumInfiniteOptions,
  forumSearchInfiniteOptions,
} from "@/lib/query/options/forum";
import SignInWarningModal from "@/components/SignInWarningModal";
import ForumPostItem from "./ForumPostItem";
import { ForumPostsSkeleton } from "./ForumPostsSkeleton";
import { likeForumPost, unlikeForumPost } from "@/services/forum";
import { setLikeForumQueryData } from "@/lib/query/set-query-data/forum";

export default function ForumPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [searchBarValue, setSearchBarValue] = useDebouncedState("", 250);
  const [signInWarningModalOpened, signInWarningModalHandler] =
    useDisclosure(false);

  const {
    data: postsData,
    isFetching: isFetchingPosts,
    fetchNextPage: fetchNextPostsPage,
    hasNextPage: hasNextPostsPage,
  } = useInfiniteQuery(forumInfiniteOptions);
  const {
    data: searchPostsData,
    isFetching: isFetchingSearchPosts,
    fetchNextPage: fetchNextSearchPostsPage,
    hasNextPage: hasNextSearchPostsPage,
  } = useInfiniteQuery(forumSearchInfiniteOptions(searchBarValue));

  useEffect(() => {
    function handleScroll() {
      if (isFetchingPosts || isFetchingSearchPosts) return;

      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500;

      if (!isNearBottom) return;

      if (searchBarValue) {
        if (hasNextSearchPostsPage) {
          fetchNextSearchPostsPage();
        }
      } else {
        if (hasNextPostsPage) {
          fetchNextPostsPage();
        }
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
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

    router.push("/forum/submit");
  };

  const handleLikeMutation = useMutation({
    mutationFn: async ({ id, like }: { id: string; like: boolean }) => {
      if (like) {
        await likeForumPost(id);
      } else {
        await unlikeForumPost(id);
      }

      return { id, like };
    },

    onSuccess: (data) => {
      setLikeForumQueryData(data);
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
                  <ForumPostItem
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                  />
                ))
            : isFetchingSearchPosts && <ForumPostsSkeleton />
          : postsData
            ? postsData.pages
                .reduce((acc, page) => acc.concat(page))
                .map((post) => (
                  <ForumPostItem
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                  />
                ))
            : isFetchingPosts && <ForumPostsSkeleton />}
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
