"use client";

import { useState } from "react";
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
import { isNotEmpty, useForm } from "@mantine/form";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";

import { type authClient } from "@/lib/auth-client";
import { setUpdateForumPostCommentQueryData } from "@/lib/set-query-data/forum";
import TextEditor from "@/components/TextEditor";
import LikeButton from "@/components/LikeButton";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import type { ForumPostCommentType } from "@/types/forum";
import { useMutation } from "@tanstack/react-query";
import { updateForumPostComment } from "@/services/forum";

export interface CommentItemProps {
  session: ReturnType<typeof authClient.useSession>["data"];
  comment: ForumPostCommentType;
  dateNow: Date;
  onLike: ({ commentId, like }: { commentId: string; like: boolean }) => void;
  onDelete: (commentId: string) => void;
}

export default function CommentItem({
  session,
  comment,
  dateNow,
  onLike,
  onDelete,
}: CommentItemProps) {
  const [isEditable, setIsEditable] = useState(false);

  const form = useForm({
    initialValues: {
      comment: comment.body,
    },
    validate: {
      comment: isNotEmpty("Comment is required"),
    },
  });

  const { editor, setNewContentState } = useTiptapEditor({
    onUpdate: ({ editor }) => {
      form.setFieldValue("comment", editor.getHTML());
    },
    placeholder: "Write a comment...",
    content: comment.body,
  });

  const handleEditable = (editable: boolean) => {
    if (!editor) return;

    setIsEditable(editable);

    if (editable) {
      editor.commands.focus("end");
    } else {
      setNewContentState(comment.body);
      editor.commands.blur();
    }
  };

  const updateMutation = useMutation({
    mutationFn: (values: typeof form.values) =>
      updateForumPostComment({
        forumId: comment.forumId,
        commentId: comment.id,
        body: values.comment,
      }),
    onSuccess: (data) => {
      setUpdateForumPostCommentQueryData({
        postId: comment.forumId,
        commentId: comment.id,
        comment: data,
      });

      handleEditable(false);

      form.setInitialValues({
        comment: data.body,
      });

      setNewContentState(data.body);

      form.reset();
    },
  });

  return (
    <Box>
      <Flex gap="md" align="center">
        <Avatar src={comment.author.image} />

        <div>
          <Text fw="bold" truncate>
            {comment.author.name || comment.author.username}
          </Text>

          <Text fz="xs" c="dimmed">
            {formatDistance(new Date(comment.createdAt), dateNow, {
              addSuffix: true,
            })}
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
                  onClick={() => handleEditable(true)}
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
          <form
            onSubmit={form.onSubmit((values) => updateMutation.mutate(values))}
          >
            <TextEditor editor={editor} />

            <Group mt="md" justify="end">
              <Button variant="default" onClick={() => handleEditable(false)}>
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!form.isDirty()}
                loading={updateMutation.isPending}
              >
                Save
              </Button>
            </Group>
          </form>
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
