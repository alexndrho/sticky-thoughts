"use client";

import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Menu,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { isNotEmptyHTML, useForm } from "@mantine/form";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";

import { type authClient } from "@/lib/auth-client";
import { setUpdateThreadPostCommentQueryData } from "@/lib/query/set-query-data/thread";
import TextEditor from "@/components/TextEditor";
import LikeButton from "@/components/LikeButton";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import type { ThreadPostCommentType } from "@/types/thread";
import { useMutation } from "@tanstack/react-query";
import { updateThreadPostComment } from "@/services/thread";
import ServerError from "@/utils/error/ServerError";

export interface CommentItemProps {
  session: ReturnType<typeof authClient.useSession>["data"];
  comment: ThreadPostCommentType;
  dateNow: Date;
  isThreadOwner: boolean;
  onLike: ({ commentId, like }: { commentId: string; like: boolean }) => void;
  onDelete: (commentId: string) => void;
}

export default function CommentItem({
  session,
  comment,
  dateNow,
  isThreadOwner,
  onLike,
  onDelete,
}: CommentItemProps) {
  const [isEditable, setIsEditable] = useState(false);

  return (
    <Box>
      <Flex gap="md" align="center">
        <Avatar src={comment.author.image} />

        <div>
          <Flex>
            <Text fw="bold" truncate>
              {comment.author.name || comment.author.username}

              {isThreadOwner && (
                <Text c="blue" fz="xs" fw="bold" span>
                  {" "}
                  OP
                </Text>
              )}
            </Text>
          </Flex>

          <Text fz="xs" c="dimmed">
            {formatDistance(new Date(comment.createdAt), dateNow, {
              addSuffix: true,
            })}

            {comment.updatedAt !== comment.createdAt && (
              <Text span inherit>
                {" "}
                (edited)
              </Text>
            )}
          </Text>
        </div>

        {session?.user.id === comment.author.id && (
          <Box ml="auto">
            <Menu>
              <Menu.Target>
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  styles={{
                    root: {
                      color: "var(--mantine-color-text)",
                    },
                  }}
                >
                  <IconDots size="1.25em" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size="1em" />}
                  onClick={() => setIsEditable(true)}
                >
                  Edit
                </Menu.Item>

                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size="1em" />}
                  onClick={() => onDelete(comment.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        )}
      </Flex>

      <Box mt="sm" pl={54}>
        {isEditable ? (
          <Editor comment={comment} onClose={() => setIsEditable(false)} />
        ) : (
          <>
            <TypographyStylesProvider>
              <div dangerouslySetInnerHTML={{ __html: comment.body }} />
            </TypographyStylesProvider>

            <LikeButton
              mt="md"
              liked={comment.likes.liked}
              count={comment.likes.count}
              size="compact-sm"
              onLike={() =>
                onLike({
                  commentId: comment.id,
                  like: !comment.likes.liked,
                })
              }
            />
          </>
        )}
      </Box>
    </Box>
  );
}

function Editor({
  comment,
  onClose,
}: {
  comment: ThreadPostCommentType;
  onClose: () => void;
}) {
  const updateForm = useForm({
    initialValues: {
      body: comment.body,
    },
    validate: {
      body: isNotEmptyHTML("Comment is required"),
    },
  });

  const editor = useTiptapEditor({
    content: comment.body,
    placeholder: "Write a comment...",
    onUpdate: ({ editor }) => {
      updateForm.setFieldValue("body", editor.getHTML());
    },
    shouldRerenderOnTransaction: false,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus("end");
    }
  }, [editor]);

  const updateMutation = useMutation({
    mutationFn: (values: typeof updateForm.values) =>
      updateThreadPostComment({
        threadId: comment.threadId,
        commentId: comment.id,
        body: values.body,
      }),
    onSuccess: (data) => {
      onClose();

      updateForm.setInitialValues({
        body: data.body,
      });
      updateForm.reset();

      setUpdateThreadPostCommentQueryData({
        threadId: comment.threadId,
        commentId: comment.id,
        comment: data,
      });
    },
    onError: (error) => {
      if (error instanceof ServerError) {
        updateForm.setFieldError("body", error.errors[0].message);
      } else {
        updateForm.setFieldError("body", "Something went wrong");
      }
    },
  });

  return (
    <form
      onSubmit={updateForm.onSubmit((values) => updateMutation.mutate(values))}
    >
      <TextEditor editor={editor} error={updateForm.errors.comment} />

      <Group mt="md" justify="end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={!updateForm.isDirty()}
          loading={updateMutation.isPending}
        >
          Save
        </Button>
      </Group>
    </form>
  );
}
