import { Avatar, Flex, Paper, Text, Title } from "@mantine/core";
import Link from "next/link";

import { stripHtmlTags } from "@/utils/text";
import classes from "@/styles/forum-post-item.module.css";

export interface ForumPostItemProps {
  id: string;
  title: string;
  body: string;
  author: {
    name: string;
    image?: string | null;
  };
}

export default function ForumPostItem({
  id,
  title,
  body,
  author,
}: ForumPostItemProps) {
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
        href={`forum/post/${id}`}
        direction="column"
        className={classes.forum__content}
      >
        <header>
          <Flex align="center" gap="xs">
            <Avatar src={author.image} size="xs" />

            <Text size="sm">{author.name}</Text>
          </Flex>
          <Title order={2} size="h3" lineClamp={2}>
            {title}
          </Title>
        </header>

        <Text lineClamp={5}>{stripHtmlTags(body)}</Text>
      </Flex>
    </Paper>
  );
}
