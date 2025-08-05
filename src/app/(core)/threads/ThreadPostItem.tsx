import { Avatar, Flex, Group, Paper, Text, Title } from "@mantine/core";
import Link from "next/link";
import { formatDistance } from "date-fns";

import { stripHtmlTags } from "@/utils/text";
import classes from "@/styles/thread-post-item.module.css";
import LikeButton from "@/app/(core)/threads/LikeButton";
import CommentButton from "@/app/(core)/threads/CommentButton";
import ShareButton from "@/app/(core)/threads/ShareButton";
import type { ThreadPostType } from "@/types/thread";

export interface ThreadPostItemProps {
  post: ThreadPostType;
  onLike?: ({ id, like }: { id: string; like: boolean }) => void;
}

export default function ThreadPostItem({ post, onLike }: ThreadPostItemProps) {
  return (
    <Paper
      component="article"
      shadow="xs"
      withBorder
      className={classes.thread}
    >
      <Flex
        component={Link}
        href={`/threads/${post.id}`}
        direction="column"
        className={classes.thread__content}
      >
        <header>
          <Flex align="center" gap="xs">
            <Avatar src={post.author.image} size="xs" />

            <Text size="sm">
              {post.author.name || post.author.username} <span>•</span>{" "}
              <span>
                {formatDistance(new Date(post.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </Text>
          </Flex>
          <Title order={2} size="h3" lineClamp={2}>
            {post.title}
          </Title>
        </header>

        <Text lineClamp={5}>{stripHtmlTags(post.body)}</Text>
      </Flex>

      <Group className={classes["thread__action-container"]}>
        <LikeButton
          liked={post.likes.liked}
          count={post.likes.count}
          size="compact-sm"
          onLike={(e) => {
            e.preventDefault();

            onLike?.({
              id: post.id,
              like: !post.likes.liked,
            });
          }}
        />

        <CommentButton
          component={Link}
          href={`/threads/${post.id}`}
          count={post.comments.count}
          size="compact-sm"
        />

        <ShareButton
          size="compact-sm"
          link={`${process.env.NEXT_PUBLIC_BASE_URL}/threads/${post.id}`}
        />
      </Group>
    </Paper>
  );
}
