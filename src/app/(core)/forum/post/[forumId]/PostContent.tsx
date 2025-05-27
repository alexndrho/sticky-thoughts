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
import { isNotEmptyHTML, useForm } from "@mantine/form";
import ServerError from "@/utils/error/ServerError";

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

  const {
    editor: updateEditor,
    setNewContentState: setUpdateEditorNewContentState,
  } = useTiptapEditor({
    content: post.body,
    onUpdate: ({ editor }) => {
      updateForm.setFieldValue("body", editor.getHTML());
    },
  });

  const updateForm = useForm({
    initialValues: {
      body: post.body,
    },
    validate: {
      body: isNotEmptyHTML("Body is required"),
    },
  });

  useEffect(() => {
    if (updateEditor) {
      setUpdateEditorNewContentState(post.body);
    }
  }, [updateEditor, setUpdateEditorNewContentState, post]);

  const updateMutation = useMutation({
    mutationFn: async ({ body }: { body: Prisma.ForumUpdateInput["body"] }) =>
      updateForumPost({
        id,
        body,
      }),
    onSuccess: (data) => {
      setIsEditable(false);

      updateForm.setInitialValues({
        body: data.body,
      });
      updateForm.reset();

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

      setUpdateEditorNewContentState(data.body);
    },
    onError: (error) => {
      if (error instanceof ServerError) {
        updateForm.setFieldError("root", error.errors[0].message);
      } else {
        updateForm.setFieldError("root", "Failed to update post");
      }
    },
  });

  // Enter edit mode
  const handleStartEdit = () => {
    if (!updateEditor) return;

    setIsEditable(true);
    updateEditor.commands.focus("end");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (!updateEditor) return;

    setIsEditable(false);
    updateForm.reset();
    setUpdateEditorNewContentState(post.body);
    updateEditor.commands.blur();
  };

  const handleUpdate = (values: typeof updateForm.values) => {
    if (values.body === post.body) {
      handleCancelEdit();
      return;
    }

    updateMutation.mutate(values);
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
                  onClick={handleStartEdit}
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
          <form onSubmit={updateForm.onSubmit(handleUpdate)}>
            <TextEditor editor={updateEditor} error={updateForm.errors.body} />

            {updateForm.errors.root && (
              <Text mt="xs" size="xs" c="red.8">
                {updateForm.errors.root}
              </Text>
            )}

            <Flex mt="md" justify="end" gap="md">
              <Button variant="default" onClick={handleCancelEdit}>
                Cancel
              </Button>

              <Button type="submit" loading={updateMutation.isPending}>
                Save
              </Button>
            </Flex>
          </form>
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
