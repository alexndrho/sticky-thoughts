"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Menu,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";

import { authClient } from "@/lib/auth-client";
import PostEditor from "./PostEditor";
import CommentEditor, { type CommentSectionRef } from "./CommentEditor";
import Comments from "./Comments";
import DeleteForumPostModal from "@/components/DeleteForumPostModal";
import { likeForumPost, unlikeForumPost } from "@/services/forum";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";
import ShareButton from "@/components/ShareButton";
import SignInWarningModal from "@/components/SignInWarningModal";
import { setLikeForumQueryData } from "@/lib/set-query-data/forum";
import type { ForumPostType } from "@/types/forum";

export interface PostProps {
  id: string;
  post: ForumPostType;
}

export default function Post({ id, post }: PostProps) {
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const [isEditable, setIsEditable] = useState(false);
  const [signInWarningModalOpened, signInWarningModalHandlers] =
    useDisclosure(false);
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false);

  const commentSectionRef = useRef<CommentSectionRef>(null);

  // Like
  const handleLikeMutation = useMutation({
    mutationFn: () => {
      if (post.likes.liked) {
        return unlikeForumPost(id);
      } else {
        return likeForumPost(id);
      }
    },

    onSuccess: () => {
      setLikeForumQueryData({
        id: post.id,
        like: !post.likes.liked,
      });
    },
  });

  const handleLike = () => {
    if (!session) {
      signInWarningModalHandlers.open();
      return;
    }

    handleLikeMutation.mutate();
  };

  return (
    <Box my="lg" w="100%">
      <Flex mb="xs" justify="space-between">
        <Flex align="center">
          <Avatar src={post.author.image} mr="xs" size="sm" />

          <Text>{post.author.name || post.author.username}</Text>
        </Flex>

        {session?.user.id === post.authorId && (
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
              <>
                <Menu.Item
                  leftSection={<IconEdit size="1em" />}
                  onClick={() => setIsEditable(true)}
                >
                  Edit
                </Menu.Item>

                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size="1em" />}
                  onClick={deleteModalHandlers.open}
                >
                  Delete
                </Menu.Item>
              </>
            </Menu.Dropdown>
          </Menu>
        )}
      </Flex>

      {isEditable ? (
        <>
          <Title>{post.title}</Title>

          <PostEditor
            id={id}
            body={post.body}
            onClose={() => setIsEditable(false)}
          />
        </>
      ) : (
        <TypographyStylesProvider>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </TypographyStylesProvider>
      )}

      <Group my="md">
        <LikeButton
          liked={post.likes.liked}
          count={post.likes.count}
          onLike={handleLike}
          size="compact-sm"
        />

        <CommentButton
          count={post.comments.count}
          size="compact-sm"
          onClick={() => commentSectionRef.current?.editor?.commands.focus()}
        />

        <ShareButton
          size="compact-sm"
          link={`${process.env.NEXT_PUBLIC_BASE_URL}/forum/post/${post.id}`}
        />
      </Group>

      <Box component="section">
        {session ? (
          <CommentEditor
            ref={commentSectionRef}
            forumId={post.id}
            onOpenSignInWarningModal={signInWarningModalHandlers.open}
          />
        ) : (
          <Center mt="lg">
            <Button
              component={Link}
              href="/sign-in"
              variant="default"
              fullWidth
            >
              Sign in to comment
            </Button>
          </Center>
        )}

        <Comments
          forumId={post.id}
          session={session}
          forumAuthor={post.authorId}
          onOpenSignInWarningModal={signInWarningModalHandlers.open}
        />
      </Box>

      {post.authorId === session?.user.id && (
        <DeleteForumPostModal
          id={post.id}
          title={post.title}
          opened={deleteModalOpened}
          onClose={deleteModalHandlers.close}
          onDelete={() => router.push("/forum")}
        />
      )}

      {!session && (
        <SignInWarningModal
          opened={signInWarningModalOpened}
          onClose={signInWarningModalHandlers.close}
        />
      )}
    </Box>
  );
}
