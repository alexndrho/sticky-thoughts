"use client";

import Link from "next/link";
import { Box, Button, Flex, Skeleton } from "@mantine/core";
import { IconMessage } from "@tabler/icons-react";

import ForumPostItem from "@/components/ForumPostItem";
import { useQuery } from "@tanstack/react-query";
import { getForumPosts } from "@/services/forum";

export default function ForumPage() {
  const queryPosts = useQuery({
    queryKey: ["posts"],
    queryFn: getForumPosts,
  });

  return (
    <Box my="xl" w="100%">
      <Flex mb="md" justify="end">
        <Button
          component={Link}
          href="/forum/submit"
          rightSection={<IconMessage />}
        >
          Submit a post
        </Button>
      </Flex>

      <Flex direction="column" gap="md">
        {queryPosts.data
          ? queryPosts.data.map((post) => (
              <ForumPostItem
                key={post.id}
                id={post.id}
                title={post.title}
                body={post.body}
                author={{
                  name: post.author.name,
                  image: post.author.image,
                }}
              />
            ))
          : Array.from({ length: 5 }, (_, i) => (
              <Skeleton
                key={i}
                height={200}
                radius="lg"
                visible={true}
                mb="md"
              />
            ))}
      </Flex>
    </Box>
  );
}
