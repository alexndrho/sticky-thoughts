"use client";

import { useEffect } from "react";
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
  Menu,
  Text,
  Title,
} from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons-react";

import { getQueryClient } from "@/lib/get-query-client";
import { authClient } from "@/lib/auth-client";
import DeleteForumPostModal from "@/components/DeleteForumPostModal";
import {
  setTiptapEditable,
  setTiptapNewContentState,
  useTiptapEditor,
} from "@/hooks/use-tiptap";
import { ForumPostType, updateForumPost } from "@/services/forum";

export interface PostContentProps {
  id: string;
  post: ForumPostType;
}

export default function PostContent({ id, post }: PostContentProps) {
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false);

  const editor = useTiptapEditor({
    editable: false,
    content: post.body,
  });

  const setEditable = (editable: boolean) => {
    if (!editor) return;

    setTiptapEditable(editor, editable);

    if (!editable) {
      setTiptapNewContentState(editor, post.body);
    }
  };

  useEffect(() => {
    if (editor) {
      setTiptapNewContentState(editor, post.body);
    }
  }, [editor, post]);

  const updateMutation = useMutation({
    mutationFn: async ({ body }: { body: Prisma.ForumUpdateInput["body"] }) =>
      updateForumPost({
        id,
        body,
      }),
    onSuccess: (data) => {
      getQueryClient().setQueryData(
        ["forum", id],
        (oldData: ForumPostType | undefined) =>
          oldData
            ? {
                ...oldData,
                ...data,
              }
            : oldData,
      );

      getQueryClient().setQueryData(
        ["forum"],
        (oldData: ForumPostType[] | undefined) =>
          oldData
            ? oldData.map((post) =>
                post.id === id ? { ...post, ...data } : post,
              )
            : oldData,
      );
    },
  });

  const handleUpdate = () => {
    if (!editor) return;

    const body = editor.getHTML();

    if (body === post?.body) {
      setEditable(false);
      return;
    }

    updateMutation.mutate({ body });
    setEditable(false);
  };

  return (
    <Box my="xl" w="100%">
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
                  onClick={() => setEditable(true)}
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

      <Title>{post.title}</Title>

      <TextEditor editor={editor} />

      {editor?.isEditable && (
        <Flex mt="md" justify="end" gap="md">
          <Button variant="default" onClick={() => setEditable(false)}>
            Cancel
          </Button>

          <Button loading={updateMutation.isPending} onClick={handleUpdate}>
            Save
          </Button>
        </Flex>
      )}

      {post.authorId === session?.user.id && (
        <DeleteForumPostModal
          id={post.id}
          title={post.title}
          opened={deleteModalOpened}
          onClose={deleteModalHandlers.close}
          onDelete={() => router.push("/forum")}
        />
      )}
    </Box>
  );
}
