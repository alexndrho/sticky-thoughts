"use client";

import { useEffect } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Box, Center, Flex, Loader } from "@mantine/core";

import { type authClient } from "@/lib/auth-client";
import { threadPostCommentsInfiniteOptions } from "@/lib/query/options/thread";
import {
  deleteThreadPostComment,
  likeThreadPostComment,
  unlikeThreadPostComment,
} from "@/services/thread";
import {
  setDeleteThreadPostCommentQueryData,
  setLikeThreadPostCommentQueryData,
} from "@/lib/query/set-query-data/thread";
import CommentItem from "./CommentItem";

export interface CommentsProps {
  threadId: string;
  session: ReturnType<typeof authClient.useSession>["data"];
  threadAuthor: string;
  dateNow: Date;
  onOpenSignInWarningModal: () => void;
}

export default function Comments({
  threadId,
  session,
  threadAuthor,
  dateNow,
  onOpenSignInWarningModal,
}: CommentsProps) {
  const {
    data: commentsData,
    isFetching: isFetchingComments,
    isRefetching: isRefetchingComments,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
  } = useInfiniteQuery(threadPostCommentsInfiniteOptions(threadId));

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteThreadPostComment({
        threadId,
        commentId,
      });

      return { commentId };
    },
    onSuccess: (data) => {
      setDeleteThreadPostCommentQueryData({
        threadId,
        commentId: data.commentId,
      });
    },
  });

  useEffect(() => {
    function handleScroll() {
      if (isFetchingComments || isRefetchingComments) return;

      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 500;

      if (!isNearBottom) return;

      if (hasNextCommentsPage) {
        fetchNextCommentsPage();
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    isFetchingComments,
    isRefetchingComments,
    hasNextCommentsPage,
    fetchNextCommentsPage,
  ]);

  const commentLikeMutation = useMutation({
    mutationFn: async ({
      commentId,
      like,
    }: {
      commentId: string;
      like: boolean;
    }) => {
      if (like) {
        await likeThreadPostComment({
          threadId,
          commentId,
        });
      } else {
        await unlikeThreadPostComment({
          threadId,
          commentId,
        });
      }

      return { commentId, like };
    },
    onSuccess: (data) => {
      setLikeThreadPostCommentQueryData({
        threadId,
        commentId: data.commentId,
        like: data.like,
      });
    },
  });

  const handleLike = ({
    commentId,
    like,
  }: {
    commentId: string;
    like: boolean;
  }) => {
    if (!session) {
      onOpenSignInWarningModal();

      return;
    }

    commentLikeMutation.mutate({
      commentId,
      like,
    });
  };

  return (
    <Box>
      {commentsData ? (
        <Flex mt="lg" direction="column" gap="lg">
          {commentsData.pages
            .reduce((acc, page) => acc.concat(page))
            .map((comment) => (
              <CommentItem
                key={comment.id}
                session={session}
                comment={comment}
                dateNow={dateNow}
                isThreadOwner={threadAuthor === comment.author.id}
                onLike={handleLike}
                onDelete={deleteMutation.mutate}
              />
            ))}
        </Flex>
      ) : (
        isFetchingComments && (
          <Center mt="lg" h={250}>
            <Loader />
          </Center>
        )
      )}
    </Box>
  );
}
