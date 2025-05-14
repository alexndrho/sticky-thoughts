import { Avatar, Flex, Paper, Text, Title } from "@mantine/core";
import Link from "next/link";

import { stripHtmlTags } from "@/utils/text";
import classes from "@/styles/forum-post-item.module.css";
import { type ForumPostType } from "@/services/forum";

export interface ForumPostItemProps {
  post: ForumPostType;
}

export default function ForumPostItem({ post }: ForumPostItemProps) {
  return (
    <Paper
      component="article"
      p="lg"
      shadow="xs"
      radius="lg"
      withBorder
      className={classes.forum}
    >
      <Flex
        component={Link}
        href={`forum/post/${post.id}`}
        direction="column"
        className={classes.forum__content}
      >
        <header>
          <Flex align="center" gap="xs">
            <Avatar src={post.author.image} size="xs" />

            <Text size="sm">{post.author.name || post.author.username}</Text>
          </Flex>
          <Title order={2} size="h3" lineClamp={2}>
            {post.title}
          </Title>
        </header>

        <Text lineClamp={5}>{stripHtmlTags(post.body)}</Text>
      </Flex>
    </Paper>
  );
}
