"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Link from "next/link";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { type Editor } from "@tiptap/react";
import { Box, Button, Center, Flex, Loader } from "@mantine/core";
import { isNotEmptyHTML, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { type authClient } from "@/lib/auth-client";
import TextEditor from "@/components/TextEditor";
import CommentItem from "./CommentItem";
import { forumPostCommentsInfiniteOptions } from "@/lib/query-options/forum";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import {
  deleteForumPostComment,
  likeForumPostComment,
  submitForumPostComment,
  unlikeForumPostComment,
} from "@/services/forum";
import ServerError from "@/utils/error/ServerError";
import {
  setCreateForumPostCommentQueryData,
  setDeleteForumPostCommentQueryData,
  setLikeForumPostCommentQueryData,
} from "@/lib/set-query-data/forum";

export interface CommentSectionProps {
  postId: string;
  session: ReturnType<typeof authClient.useSession>["data"];
  onOpenSignInWarningModal: () => void;
}

export interface CommentSectionRef {
  editor: Editor | null;
}

const CommentSection = forwardRef<CommentSectionRef, CommentSectionProps>(
  ({ postId, session, onOpenSignInWarningModal }, ref) => {
    const [dateNow, setDateNow] = useState(new Date());

    useImperativeHandle(ref, () => ({ editor }));

    // form
    const form = useForm({
      initialValues: {
        comment: "<p></p>",
      },
      validate: {
        comment: isNotEmptyHTML("Comment is required"),
      },
    });

    const { editor, setNewContentState } = useTiptapEditor({
      onUpdate: ({ editor }) => {
        form.setFieldValue("comment", editor.getHTML());
      },
      placeholder: "Write a comment...",
      content: "<p></p>",
    });

    const commentMutation = useMutation({
      mutationFn: (values: { comment: string }) =>
        submitForumPostComment({
          id: postId,
          body: values.comment,
        }),
      onSuccess: (data) => {
        setCreateForumPostCommentQueryData({ id: postId, comment: data });

        form.reset();
        editor?.commands.clearContent();

        if (editor) setNewContentState("<p></p>");

        notifications.show({
          title: "Comment submitted",
          message: "Your comment has been submitted successfully.",
        });
      },
      onError: (error) => {
        if (error instanceof ServerError) {
          form.setFieldError("comment", error.errors[0].message);
        } else {
          form.setFieldError("comment", "Something went wrong");
        }
      },
    });

    // comments
    const queryComments = useInfiniteQuery(
      forumPostCommentsInfiniteOptions(postId),
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setDateNow(new Date());
      }, 1000 * 60);

      return () => clearInterval(interval);
    }, []);

    const deleteMutation = useMutation({
      mutationFn: async (commentId: string) => {
        await deleteForumPostComment({
          forumId: postId,
          commentId,
        });

        return { commentId };
      },
      onSuccess: (data) => {
        setDeleteForumPostCommentQueryData({
          postId,
          commentId: data.commentId,
        });
      },
    });

    useEffect(() => {
      function handleScroll() {
        if (queryComments.isFetching || queryComments.isRefetching) return;

        const isNearBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 500;

        if (!isNearBottom) return;

        if (queryComments.hasNextPage) {
          queryComments.fetchNextPage();
        }
      }

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [queryComments]);

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
            forumId: postId,
            commentId: commendId,
          });
        } else {
          await unlikeForumPostComment({
            forumId: postId,
            commentId: commendId,
          });
        }

        return { commendId, like };
      },
      onSuccess: (data) => {
        setLikeForumPostCommentQueryData({
          postId,
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
      <Box component="section">
        {session ? (
          <form
            onSubmit={form.onSubmit((values) => commentMutation.mutate(values))}
          >
            <Flex direction="column">
              <TextEditor editor={editor} error={form.errors.comment} />

              <Flex mt="md" justify="end">
                <Button
                  type="submit"
                  disabled={!form.isDirty()}
                  loading={commentMutation.isPending}
                >
                  Comment
                </Button>
              </Flex>
            </Flex>
          </form>
        ) : (
          <Flex justify="center" mt="lg">
            <Button
              component={Link}
              href="/sign-in"
              variant="default"
              fullWidth
            >
              Sign in to comment
            </Button>
          </Flex>
        )}

        {queryComments.data ? (
          <Flex mt="lg" direction="column" gap="lg">
            {queryComments.data.pages
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
          queryComments.isFetching && (
            <Center mt="lg" h={250}>
              <Loader />
            </Center>
          )
        )}
      </Box>
    );
  },
);

CommentSection.displayName = "CommentSection";
export default CommentSection;
