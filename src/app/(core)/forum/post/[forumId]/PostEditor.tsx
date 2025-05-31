import { Button, Flex, Text } from "@mantine/core";

import TextEditor from "@/components/TextEditor";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import { isNotEmptyHTML, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import type { Prisma } from "@prisma/client";
import { updateForumPost } from "@/services/forum";
import { getQueryClient } from "@/lib/get-query-client";
import {
  forumInfiniteOptions,
  forumPostOptions,
} from "@/lib/query/options/forum";
import type { ForumPostType } from "@/types/forum";
import ServerError from "@/utils/error/ServerError";
import { useEffect } from "react";

export interface PostEditorProps {
  id: string;
  body: string;
  onClose: () => void;
}

export default function PostEditor({ id, body, onClose }: PostEditorProps) {
  const editor = useTiptapEditor({
    content: body,
    placeholder: "Edit your post...",
    onUpdate: ({ editor }) => {
      updateForm.setFieldValue("body", editor.getHTML());
    },
    shouldRerenderOnTransaction: false,
  });

  const updateForm = useForm({
    initialValues: {
      body,
    },
    validate: {
      body: isNotEmptyHTML("Body is required"),
    },
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus("end");
    }
  }, [editor]);

  const updateMutation = useMutation({
    mutationFn: async ({ body }: { body: Prisma.ForumUpdateInput["body"] }) =>
      updateForumPost({
        id,
        body,
      }),
    onSuccess: (data) => {
      onClose();

      updateForm.setInitialValues({
        body: data.body,
      });
      updateForm.reset();

      getQueryClient().setQueryData(
        forumPostOptions(id).queryKey,
        (oldData: ForumPostType | undefined) =>
          oldData
            ? {
                ...oldData,
                ...data,
              }
            : oldData,
      );

      getQueryClient().invalidateQueries({
        queryKey: forumPostOptions(id).queryKey,
        refetchType: "none",
      });

      getQueryClient().invalidateQueries({
        queryKey: forumInfiniteOptions.queryKey,
      });
    },
    onError: (error) => {
      if (error instanceof ServerError) {
        updateForm.setFieldError("root", error.errors[0].message);
      } else {
        updateForm.setFieldError("root", "Failed to update post");
      }
    },
  });

  return (
    <form
      onSubmit={updateForm.onSubmit((values) => updateMutation.mutate(values))}
    >
      <TextEditor editor={editor} error={updateForm.errors.body} />

      {updateForm.errors.root && (
        <Text mt="xs" size="xs" c="red.8">
          {updateForm.errors.root}
        </Text>
      )}

      <Flex mt="md" justify="end" gap="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>

        <Button
          type="submit"
          loading={updateMutation.isPending}
          disabled={!updateForm.isDirty()}
        >
          Save
        </Button>
      </Flex>
    </form>
  );
}
