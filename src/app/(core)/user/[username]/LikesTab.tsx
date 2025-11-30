"use client";

import { Flex, Group, Loader, Tabs } from "@mantine/core";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { userLikedThreadsInfiniteOptions } from "@/lib/query/options/user";
import { setLikeThreadQueryData } from "@/lib/query/set-query-data/thread";
import { useIsNearScrollEnd } from "@/hooks/use-is-near-scroll-end";
import { useEffect } from "react";
import ThreadItem from "../../threads/ThreadItem";
import { likeThread, unlikeThread } from "@/services/thread";

export interface LikesTabProps {
  username: string;
  session: ReturnType<typeof authClient.useSession>["data"];
  openSignInWarningModal: () => void;
}

export default function LikesTab({
  username,
  session,
  openSignInWarningModal,
}: LikesTabProps) {
  const isNearScrollEnd = useIsNearScrollEnd();

  const {
    data: likedThreads,
    isFetching: isLikedThreadsFetching,
    fetchNextPage: fetchNextLikedThreadsPage,
    hasNextPage: hasNextLikedThreadsPage,
  } = useInfiniteQuery(userLikedThreadsInfiniteOptions(username));

  useEffect(() => {
    if (isLikedThreadsFetching) return;

    if (!isNearScrollEnd) return;

    if (hasNextLikedThreadsPage) {
      fetchNextLikedThreadsPage();
    }
  }, [
    isNearScrollEnd,
    isLikedThreadsFetching,
    hasNextLikedThreadsPage,
    fetchNextLikedThreadsPage,
  ]);

  const likeMutation = useMutation({
    mutationFn: async ({ id, like }: { id: string; like: boolean }) => {
      if (like) {
        await likeThread(id);
      } else {
        await unlikeThread(id);
      }

      return { id, like };
    },

    onSuccess: (data) => {
      setLikeThreadQueryData({
        username,
        threadId: data.id,
        like: data.like,
      });
    },
  });

  const handleLike = ({ id, like }: { id: string; like: boolean }) => {
    if (!session) {
      openSignInWarningModal();
      return;
    }

    likeMutation.mutate({ id, like });
  };

  return (
    <Tabs.Panel value="likes" py="md">
      <Flex direction="column" gap="md">
        {likedThreads?.pages.map((page) =>
          page.map((thread) => (
            <ThreadItem key={thread.id} post={thread} onLike={handleLike} />
          )),
        )}
      </Flex>

      <Group my="xl" h="2.25rem" justify="center">
        {isLikedThreadsFetching && <Loader />}
      </Group>
    </Tabs.Panel>
  );
}
