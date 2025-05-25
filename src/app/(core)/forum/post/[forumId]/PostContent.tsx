"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type Prisma } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import TextEditor from "@/components/TextEditor";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Menu,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";

import { getQueryClient } from "@/lib/get-query-client";
import { authClient } from "@/lib/auth-client";
import {
  forumInfiniteOptions,
  forumPostOptions,
} from "@/lib/query-options/forum";
import CommentSection, { type CommentSectionRef } from "./CommentSection";
import DeleteForumPostModal from "@/components/DeleteForumPostModal";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import {
  likeForumPost,
  unlikeForumPost,
  updateForumPost,
} from "@/services/forum";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";
import ShareButton from "@/components/ShareButton";
import { ForumPostType } from "@/types/forum";
import SignInWarningModal from "@/components/SignInWarningModal";
import { setLikeForumQueryData } from "@/lib/set-query-data/forum";

export interface PostContentProps {
  id: string;
  post: ForumPostType;
}

export default function PostContent({ id, post }: PostContentProps) {
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const [isEditable, setIsEditable] = useState(false);
  const [signInWarningModalOpened, signInWarningModalHandlers] =
    useDisclosure(false);
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false);

  const commentSectionRef = useRef<CommentSectionRef>(null);

  const { editor, setNewContentState } = useTiptapEditor({
    content: post.body,
  });

  useEffect(() => {
    if (editor) {
      setNewContentState(post.body);
    }
  }, [editor, setNewContentState, post]);

  const updateMutation = useMutation({
    mutationFn: async ({ body }: { body: Prisma.ForumUpdateInput["body"] }) =>
      updateForumPost({
        id,
        body,
      }),
    onSuccess: (data) => {
      getQueryClient().setQueryData(
        forumPostOptions(id).queryKey,
        (oldData: ForumPostType | undefined) =>
          oldData
            ? {
                ...oldData,
                ...data,
              }
            : oldData,
      );

      getQueryClient().invalidateQueries({
        queryKey: forumPostOptions(id).queryKey,
        refetchType: "none",
      });

      getQueryClient().invalidateQueries({
        queryKey: forumInfiniteOptions.queryKey,
      });
    },
  });

  const handleEditable = (editable: boolean) => {
    if (!editor) return;

    setIsEditable(editable);

    if (editable) {
      editor.commands.focus("end");
    } else {
      setNewContentState(post.body);
      editor.commands.blur();
    }
  };

  const handleUpdate = () => {
    if (!editor) return;

    const body = editor.getHTML();

    if (body === post?.body) {
      handleEditable(false);
      return;
    }

    updateMutation.mutate({ body });
    handleEditable(false);
  };

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
                  onClick={() => handleEditable(true)}
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
          <TextEditor editor={editor} />
        </>
      ) : (
        <TypographyStylesProvider>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </TypographyStylesProvider>
      )}

      {isEditable && (
        <Flex mt="md" justify="end" gap="md">
          <Button variant="default" onClick={() => handleEditable(false)}>
            Cancel
          </Button>

          <Button loading={updateMutation.isPending} onClick={handleUpdate}>
            Save
          </Button>
        </Flex>
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

      <CommentSection
        ref={commentSectionRef}
        postId={post.id}
        session={session}
        onOpenSignInWarningModal={signInWarningModalHandlers.open}
      />

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
