"use client";

import { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { Box, Center, Flex, Loader } from "@mantine/core";

import { type authClient } from "@/lib/auth-client";
import { forumPostCommentsInfiniteOptions } from "@/lib/query-options/forum";
import {
  deleteForumPostComment,
  likeForumPostComment,
  unlikeForumPostComment,
} from "@/services/forum";
import {
  setDeleteForumPostCommentQueryData,
  setLikeForumPostCommentQueryData,
} from "@/lib/set-query-data/forum";
import CommentItem from "./CommentItem";

export interface CommentsProps {
  forumId: string;
  session: ReturnType<typeof authClient.useSession>["data"];
  onOpenSignInWarningModal: () => void;
}

export default function Comments({
  forumId,
  session,
  onOpenSignInWarningModal,
}: CommentsProps) {
  const [dateNow, setDateNow] = useState(new Date());

  const {
    data: commentsData,
    isFetching: isFetchingComments,
    isRefetching: isRefetchingComments,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
  } = useInfiniteQuery(forumPostCommentsInfiniteOptions(forumId));

  useEffect(() => {
    const interval = setInterval(() => {
      setDateNow(new Date());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteForumPostComment({
        forumId,
        commentId,
      });

      return { commentId };
    },
    onSuccess: (data) => {
      setDeleteForumPostCommentQueryData({
        forumId,
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
      commendId,
      like,
    }: {
      commendId: string;
      like: boolean;
    }) => {
      if (like) {
        await likeForumPostComment({
          forumId: forumId,
          commentId: commendId,
        });
      } else {
        await unlikeForumPostComment({
          forumId: forumId,
          commentId: commendId,
        });
      }

      return { commendId, like };
    },
    onSuccess: (data) => {
      setLikeForumPostCommentQueryData({
        forumId,
        commentId: data.commendId,
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
      commendId: commentId,
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
