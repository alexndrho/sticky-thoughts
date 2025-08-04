import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Modal, Text } from "@mantine/core";

import { getQueryClient } from "@/lib/get-query-client";
import { threadInfiniteOptions } from "@/lib/query/options/thread";
import { deleteThreadPost } from "@/services/thread";

export interface DeleteThreadPostModalProps {
  id: string;
  title: string;
  opened: boolean;
  onClose: () => void;
  onDelete?: () => void;
}

export default function DeleteThreadPostModal({
  id,
  title,
  opened,
  onClose,
  onDelete,
}: DeleteThreadPostModalProps) {
  const deleteMutation = useMutation({
    mutationFn: () => deleteThreadPost(id),
    onSuccess: () => {
      if (onDelete) onDelete();

      getQueryClient().invalidateQueries({
        queryKey: threadInfiniteOptions.queryKey,
      });

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
