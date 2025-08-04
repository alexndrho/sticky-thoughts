"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useMutation } from "@tanstack/react-query";
import { type Editor } from "@tiptap/react";
import { Button, Flex } from "@mantine/core";
import { isNotEmptyHTML, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import TextEditor from "@/components/TextEditor";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import { submitThreadPostComment } from "@/services/thread";
import ServerError from "@/utils/error/ServerError";
import { setCreateThreadPostCommentQueryData } from "@/lib/query/set-query-data/thread";

export interface CommentEditorProps {
  threadId: string;
  onOpenSignInWarningModal: () => void;
}

export interface CommentSectionRef {
  editor: Editor | null;
}

const CommentEditor = forwardRef<CommentSectionRef, CommentEditorProps>(
  ({ threadId }, ref) => {
    useImperativeHandle(ref, () => ({ editor }));

    const form = useForm({
      initialValues: {
        body: "<p></p>",
      },
      validate: {
        body: isNotEmptyHTML("Comment is required"),
      },
    });

    const editor = useTiptapEditor({
      content: "<p></p>",
      placeholder: "Write a comment...",
      onUpdate: ({ editor }) => {
        form.setFieldValue("body", editor.getHTML());
      },
      shouldRerenderOnTransaction: false,
    });

    const commentMutation = useMutation({
      mutationFn: (values: typeof form.values) =>
        submitThreadPostComment({
          id: threadId,
          body: values.body,
        }),
      onSuccess: (data) => {
        setCreateThreadPostCommentQueryData({ id: threadId, comment: data });

        form.reset();
        editor?.commands.clearContent();

        notifications.show({
          title: "Comment submitted",
          message: "Your comment has been submitted successfully.",
        });
      },
      onError: (error) => {
        if (error instanceof ServerError) {
          form.setFieldError("body", error.errors[0].message);
        } else {
          form.setFieldError("body", "Something went wrong");
        }
      },
    });

    return (
      <form
        onSubmit={form.onSubmit((values) => commentMutation.mutate(values))}
      >
        <Flex direction="column">
          <TextEditor editor={editor} error={form.errors.body} />

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
