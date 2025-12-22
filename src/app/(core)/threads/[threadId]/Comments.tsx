"use client";

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Center, Flex, Loader } from "@mantine/core";

import { type authClient } from "@/lib/auth-client";
import { threadCommentsInfiniteOptions } from "@/app/(core)/threads/options";
import {
  deleteThreadComment,
  likeThreadComment,
  unlikeThreadComment,
} from "@/services/thread";
import {
  setDeleteThreadCommentQueryData,
  setLikeThreadCommentQueryData,
} from "@/app/(core)/threads/set-query-data";
import InfiniteScroll from "@/components/InfiniteScroll";
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
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
    isRefetching: isRefetchingComments,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
  } = useInfiniteQuery(threadCommentsInfiniteOptions(threadId));

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteThreadComment({
        threadId,
        commentId,
      });

      return { commentId };
    },
    onSuccess: (data) => {
      setDeleteThreadCommentQueryData({
        threadId,
        commentId: data.commentId,
      });
    },
  });

  const commentLikeMutation = useMutation({
    mutationFn: async ({
      commentId,
      like,
    }: {
      commentId: string;
      like: boolean;
    }) => {
      if (like) {
        await likeThreadComment({
          threadId,
          commentId,
        });
      } else {
        await unlikeThreadComment({
          threadId,
          commentId,
        });
      }

      return { commentId, like };
    },
    onSuccess: (data) => {
      setLikeThreadCommentQueryData({
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
    <InfiniteScroll
      onLoadMore={fetchNextCommentsPage}
      hasNext={hasNextCommentsPage}
      loading={isFetchingComments || isRefetchingComments}
    >
      <Flex mt="lg" direction="column" gap="lg">
        {commentsData?.pages
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

        {isFetchingComments && (
          <Center mt="lg" h={isLoadingComments ? 250 : undefined}>
            <Loader />
          </Center>
        )}
      </Flex>
    </InfiniteScroll>
  );
}
