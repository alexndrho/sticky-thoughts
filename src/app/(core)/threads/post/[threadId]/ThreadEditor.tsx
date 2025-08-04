import { Button, Flex, Text } from "@mantine/core";

import TextEditor from "@/components/TextEditor";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import { isNotEmptyHTML, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import type { Prisma } from "@prisma/client";
import { updateThreadPost } from "@/services/thread";
import { getQueryClient } from "@/lib/get-query-client";
import {
  threadInfiniteOptions,
  threadPostOptions,
} from "@/lib/query/options/thread";
import type { ThreadPostType } from "@/types/thread";
import ServerError from "@/utils/error/ServerError";
import { useEffect } from "react";

export interface ForumEditorProps {
  id: string;
  body: string;
  onClose: () => void;
}

export default function ForumEditor({ id, body, onClose }: ForumEditorProps) {
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
    mutationFn: async ({ body }: { body: Prisma.ThreadUpdateInput["body"] }) =>
      updateThreadPost({
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
        threadPostOptions(id).queryKey,
        (oldData: ThreadPostType | undefined) =>
          oldData
            ? {
                ...oldData,
                ...data,
              }
            : oldData,
      );

      getQueryClient().invalidateQueries({
        queryKey: threadPostOptions(id).queryKey,
        refetchType: "none",
      });

      getQueryClient().invalidateQueries({
        queryKey: threadInfiniteOptions.queryKey,
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
