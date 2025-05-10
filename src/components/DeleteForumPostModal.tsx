import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Modal, Text } from "@mantine/core";

import { getQueryClient } from "@/app/providers";
import { deleteForumPost, ForumPostType } from "@/services/forum";

export interface DeleteForumPostModalProps {
  id: string;
  title: string;
  opened: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export default function DeleteForumPostModal({
  id,
  title,
  opened,
  onClose,
  onDelete,
}: DeleteForumPostModalProps) {
  const deleteMutation = useMutation({
    mutationFn: () => deleteForumPost(id),
    onSuccess: () => {
      if (onDelete) onDelete();

      getQueryClient().invalidateQueries({ queryKey: ["forum", id] });

      getQueryClient().setQueryData(
        ["forum"],
        (oldData: ForumPostType[] | undefined) =>
          oldData ? oldData.filter((post) => post.id !== id) : oldData,
      );

      onClose();
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Are you sure you want to delete "${title}"?`}
      centered
    >
      <Text mb="md">
        This action cannot be undone. Please confirm that you want to delete
        this post.
      </Text>

      <Flex justify="end" gap="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>

        <Button
          color="red"
          loading={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate()}
        >
          Delete
        </Button>
      </Flex>
    </Modal>
  );
}
