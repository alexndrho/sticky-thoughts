"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { type Prisma } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { ForumPostType, getForumPost, updateForumPost } from "@/services/forum";
import { useDisclosure } from "@mantine/hooks";

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false);

  const query = useQuery({
    queryKey: ["forum", params.id],
    queryFn: () => getForumPost(params.id),
  });

  const editor = useTiptapEditor({
    editable: false,
    content: query.data?.body,
  });

  const setEditable = (editable: boolean) => {
    if (!editor) return;

    setTiptapEditable(editor, editable);

    if (!editable && query.data) {
      setTiptapNewContentState(editor, query.data.body);
    }
  };

  useEffect(() => {
    if (editor && query.data) {
      setTiptapNewContentState(editor, query.data.body);
    }
  }, [editor, query.data]);

  const updateMutation = useMutation({
    mutationFn: async ({ body }: { body: Prisma.ForumUpdateInput["body"] }) =>
      updateForumPost({
        id: params.id,
        body,
      }),
    onSuccess: (data) => {
      getQueryClient().setQueryData(
        ["forum", params.id],
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
                post.id === params.id ? { ...post, ...data } : post,
              )
            : oldData,
      );
    },
  });

  const handleUpdate = () => {
    if (!editor) return;

    const body = editor.getHTML();

    if (body === query.data?.body) {
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
          <Avatar src={query.data?.author.image} mr="xs" size="sm" />

          <Text>{query.data?.author.name || query.data?.author.username}</Text>
        </Flex>

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
            {session?.user.id === query.data?.authorId && (
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
            )}
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <Title>{query.data?.title}</Title>

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

      {query.data && query.data.authorId === session?.user.id && (
        <DeleteForumPostModal
          id={query.data.id}
          title={query.data.title}
          opened={deleteModalOpened}
          onClose={deleteModalHandlers.close}
          onDelete={() => router.push("/forum")}
        />
      )}
    </Box>
  );
}
