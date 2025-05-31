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
import ForumEditor from "./ForumEditor";
import CommentEditor, { type CommentSectionRef } from "./CommentEditor";
import Comments from "./Comments";
import DeleteForumPostModal from "@/components/DeleteForumPostModal";
import { likeForumPost, unlikeForumPost } from "@/services/forum";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";
import ShareButton from "@/components/ShareButton";
import SignInWarningModal from "@/components/SignInWarningModal";
import { setLikeForumQueryData } from "@/lib/query/set-query-data/forum";
import type { ForumPostType } from "@/types/forum";

export interface ContentProps {
  id: string;
  forum: ForumPostType;
}

export default function Content({ id, forum }: ContentProps) {
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
      if (forum.likes.liked) {
        return unlikeForumPost(id);
      } else {
        return likeForumPost(id);
      }
    },

    onSuccess: () => {
      setLikeForumQueryData({
        id: forum.id,
        like: !forum.likes.liked,
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
          <Avatar src={forum.author.image} mr="xs" size="sm" />

          <Text>{forum.author.name || forum.author.username}</Text>
        </Flex>

        {session?.user.id === forum.authorId && (
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
          <Title>{forum.title}</Title>

          <ForumEditor
            id={id}
            body={forum.body}
            onClose={() => setIsEditable(false)}
          />
        </>
      ) : (
        <TypographyStylesProvider>
          <h1>{forum.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: forum.body }} />
        </TypographyStylesProvider>
      )}

      <Group my="md">
        <LikeButton
          liked={forum.likes.liked}
          count={forum.likes.count}
          onLike={handleLike}
          size="compact-sm"
        />

        <CommentButton
          count={forum.comments.count}
          size="compact-sm"
          onClick={() => commentSectionRef.current?.editor?.commands.focus()}
        />

        <ShareButton
          size="compact-sm"
          link={`${process.env.NEXT_PUBLIC_BASE_URL}/forum/post/${forum.id}`}
        />
      </Group>

      <Box component="section">
        {session ? (
          <CommentEditor
            ref={commentSectionRef}
            forumId={forum.id}
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
          forumId={forum.id}
          session={session}
          forumAuthor={forum.authorId}
          onOpenSignInWarningModal={signInWarningModalHandlers.open}
        />
      </Box>

      {forum.authorId === session?.user.id && (
        <DeleteForumPostModal
          id={forum.id}
          title={forum.title}
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
