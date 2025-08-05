"use client";

import { useEffect, useRef, useState } from "react";
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
import { formatDistance } from "date-fns";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";

import { authClient } from "@/lib/auth-client";
import ThreadEditor from "./ThreadEditor";
import CommentEditor, { type CommentSectionRef } from "./CommentEditor";
import Comments from "./Comments";
import DeleteThreadPostModal from "@/app/(core)/threads/[threadId]/DeleteThreadPostModal";
import { likeThreadPost, unlikeThreadPost } from "@/services/thread";
import LikeButton from "@/app/(core)/threads/LikeButton";
import CommentButton from "@/app/(core)/threads/CommentButton";
import ShareButton from "@/app/(core)/threads/ShareButton";
import SignInWarningModal from "@/components/SignInWarningModal";
import { setLikeThreadQueryData } from "@/lib/query/set-query-data/thread";
import type { ThreadPostType } from "@/types/thread";

export interface ContentProps {
  id: string;
  thread: ThreadPostType;
}

export default function Content({ id, thread }: ContentProps) {
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const [dateNow, setDateNow] = useState(new Date());
  const [isEditable, setIsEditable] = useState(false);
  const [signInWarningModalOpened, signInWarningModalHandlers] =
    useDisclosure(false);
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false);

  const commentSectionRef = useRef<CommentSectionRef>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateNow(new Date());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  // Like
  const handleLikeMutation = useMutation({
    mutationFn: () => {
      if (thread.likes.liked) {
        return unlikeThreadPost(id);
      } else {
        return likeThreadPost(id);
      }
    },

    onSuccess: () => {
      setLikeThreadQueryData({
        id: thread.id,
        like: !thread.likes.liked,
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
          <Avatar src={thread.author.image} mr="xs" />

          <div>
            <Text>{thread.author.name || thread.author.username}</Text>

            <Text fz="xs" c="dimmed">
              {formatDistance(new Date(thread.createdAt), dateNow, {
                addSuffix: true,
              })}

              {thread.updatedAt !== thread.createdAt && (
                <Text span inherit>
                  {" "}
                  (edited)
                </Text>
              )}
            </Text>
          </div>
        </Flex>

        {session?.user.id === thread.authorId && (
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
          <Title>{thread.title}</Title>

          <ThreadEditor
            id={id}
            body={thread.body}
            onClose={() => setIsEditable(false)}
          />
        </>
      ) : (
        <TypographyStylesProvider>
          <h1>{thread.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: thread.body }} />
        </TypographyStylesProvider>
      )}

      <Group my="md">
        <LikeButton
          liked={thread.likes.liked}
          count={thread.likes.count}
          onLike={handleLike}
          size="compact-sm"
        />

        <CommentButton
          count={thread.comments.count}
          size="compact-sm"
          onClick={() => commentSectionRef.current?.editor?.commands.focus()}
        />

        <ShareButton
          size="compact-sm"
          link={`${process.env.NEXT_PUBLIC_BASE_URL}/threads/${thread.id}`}
        />
      </Group>

      <Box component="section">
        {session ? (
          <CommentEditor
            ref={commentSectionRef}
            threadId={thread.id}
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
          threadId={thread.id}
          session={session}
          threadAuthor={thread.authorId}
          dateNow={dateNow}
          onOpenSignInWarningModal={signInWarningModalHandlers.open}
        />
      </Box>

      {thread.authorId === session?.user.id && (
        <DeleteThreadPostModal
          id={thread.id}
          title={thread.title}
          opened={deleteModalOpened}
          onClose={deleteModalHandlers.close}
          onDelete={() => router.push("/threads")}
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
