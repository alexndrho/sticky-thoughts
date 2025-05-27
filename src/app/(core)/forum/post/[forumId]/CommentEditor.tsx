"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Editor } from "@tiptap/react";
import { Button, Flex } from "@mantine/core";
import { isNotEmptyHTML, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import TextEditor from "@/components/TextEditor";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import { submitForumPostComment } from "@/services/forum";
import ServerError from "@/utils/error/ServerError";
import { setCreateForumPostCommentQueryData } from "@/lib/set-query-data/forum";

export interface CommentEditorProps {
  forumId: string;
  onOpenSignInWarningModal: () => void;
}

export interface CommentSectionRef {
  editor: Editor | null;
}

const CommentEditor = forwardRef<CommentSectionRef, CommentEditorProps>(
  ({ forumId }, ref) => {
    useImperativeHandle(ref, () => ({ editor }));

    const form = useForm({
      initialValues: {
        comment: "<p></p>",
      },
      validate: {
        comment: isNotEmptyHTML("Comment is required"),
      },
    });

    const editor = useTiptapEditor({
      onUpdate: ({ editor }) => {
        form.setFieldValue("comment", editor.getHTML());
      },
      placeholder: "Write a comment...",
      content: "<p></p>",
    });

    const commentMutation = useMutation({
      mutationFn: (values: { comment: string }) =>
        submitForumPostComment({
          id: forumId,
          body: values.comment,
        }),
      onSuccess: (data) => {
        setCreateForumPostCommentQueryData({ id: forumId, comment: data });

        form.reset();
        editor?.commands.clearContent();

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

    return (
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
    );
  },
);

CommentEditor.displayName = "CommentEditor";
export default CommentEditor;
