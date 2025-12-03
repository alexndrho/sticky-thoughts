"use client";

import { useEffect } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Flex, Group, Loader, Tabs } from "@mantine/core";

import type { authClient } from "@/lib/auth-client";
import ThreadItem from "../../threads/ThreadItem";
import { userThreadsInfiniteOptions } from "@/app/(core)/user/options";
import { likeThread, unlikeThread } from "@/services/thread";
import { useIsNearScrollEnd } from "@/hooks/use-is-near-scroll-end";
import { setLikeThreadQueryData } from "@/app/(core)/threads/set-query-data";

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

    likeMutation.mutate({ id, like });
  };

  return (
    <Tabs.Panel value="threads" py="md">
      <Flex direction="column" gap="md">
        {threads?.pages.map((page) =>
          page.map((thread) => (
            <ThreadItem key={thread.id} post={thread} onLike={handleLike} />
          )),
        )}
      </Flex>

      <Group my="xl" h="2.25rem" justify="center">
        {isThreadsFetching && <Loader />}
      </Group>
    </Tabs.Panel>
  );
}
