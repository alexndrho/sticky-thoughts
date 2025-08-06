"use client";

import { useEffect } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Flex, Group, Loader, Tabs } from "@mantine/core";

import type { authClient } from "@/lib/auth-client";
import ThreadPostItem from "../../threads/ThreadPostItem";
import { userThreadsInfiniteOptions } from "@/lib/query/options/user";
import { likeThreadPost, unlikeThreadPost } from "@/services/thread";
import { useIsNearScrollEnd } from "@/hooks/use-is-near-scroll-end";
import { setLikeThreadQueryData } from "@/lib/query/set-query-data/thread";

interface ThreadsTabProps {
  username: string;
  session: ReturnType<typeof authClient.useSession>["data"];
  openSignInWarningModal: () => void;
}

export default function Threads({
  username,
  session,
  openSignInWarningModal,
}: ThreadsTabProps) {
  const isNearScrollEnd = useIsNearScrollEnd();

  const {
    data: threads,
    isFetching: isThreadsFetching,
    fetchNextPage: fetchNextThreadsPage,
    hasNextPage: hasNextThreadsPage,
  } = useInfiniteQuery(userThreadsInfiniteOptions(username));

  const handleLikeMutation = useMutation({
    mutationFn: async ({ id, like }: { id: string; like: boolean }) => {
      if (like) {
        await likeThreadPost(id);
      } else {
        await unlikeThreadPost(id);
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

  useEffect(() => {
    if (isThreadsFetching) return;

    if (!isNearScrollEnd) return;

    if (hasNextThreadsPage) {
      fetchNextThreadsPage();
    }
  }, [
    isNearScrollEnd,
    isThreadsFetching,
    hasNextThreadsPage,
    fetchNextThreadsPage,
  ]);

  const handleLike = ({ id, like }: { id: string; like: boolean }) => {
    if (!session) {
      openSignInWarningModal();
      return;
    }

    handleLikeMutation.mutate({ id, like });
  };

  return (
    <Tabs.Panel value="threads" py="md">
      <Flex direction="column" gap="md">
        {threads?.pages.map((page) =>
          page.map((thread) => (
            <ThreadPostItem key={thread.id} post={thread} onLike={handleLike} />
          )),
        )}
      </Flex>

      <Group my="xl" h="2.25rem" justify="center">
        {isThreadsFetching && <Loader />}
      </Group>
    </Tabs.Panel>
  );
}
