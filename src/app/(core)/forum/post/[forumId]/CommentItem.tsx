import { formatDistance } from "date-fns";
import {
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Menu,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons-react";

import { type authClient } from "@/lib/auth-client";
import LikeButton from "@/components/LikeButton";
import type { ForumPostCommentType } from "@/types/forum";

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
      </Box>
    </Box>
  );
}
