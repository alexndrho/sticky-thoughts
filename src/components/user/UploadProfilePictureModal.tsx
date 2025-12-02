"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  FileButton,
  Flex,
  Group,
  Modal,
  Text,
  UnstyledButton,
} from "@mantine/core";

import { authClient } from "@/lib/auth-client";
import { uploadProfilePicture } from "@/services/user";
import { getQueryClient } from "@/lib/get-query-client";
import {
  threadInfiniteOptions,
  threadBaseOptions,
} from "@/lib/query/options/thread";
import ServerError from "@/utils/error/ServerError";

export interface UploadProfilePictureModalProps {
  opened: boolean;
  onClose: () => void;
  defaultImage?: string;
}

export default function UploadProfilePictureModal({
  opened,
  onClose,
}: UploadProfilePictureModalProps) {
  const { refetch: refetchSession } = authClient.useSession();

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up object URL to prevent memory leaks
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const mutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: async () => {
      refetchSession();

      onClose();

      setImage(null);
      setPreviewUrl(null);
      setError(null);

      const queryClient = getQueryClient();

      queryClient.invalidateQueries({
        queryKey: threadBaseOptions.queryKey,
      });

      queryClient.invalidateQueries({
        queryKey: threadInfiniteOptions.queryKey,
      });
    },
    onError: (err) => {
      if (err instanceof ServerError) {
        setError(err.issues[0].message);
      } else {
        setError("An error occurred while uploading the image");
      }
    },
  });

  const handleUpload = async () => {
    if (!image) return;

    setError(null);

    const formData = new FormData();
    formData.append("user-image", image);

    mutation.mutate(formData);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Upload Profile Picture"
      centered
    >
      <Flex justify="center">
        <Avatar
          component={UnstyledButton}
          m="lg"
          w={200}
          h={200}
          src={previewUrl || undefined}
        />
      </Flex>

      {error && (
        <Group mt="md">
          <Text c="red.8" size="sm">
            {error}
          </Text>
        </Group>
      )}

      <Group mt="md" justify="end">
        <FileButton
          onChange={setImage}
          accept="image/png,image/jpeg,image/jpg,image/webp"
        >
          {(props) => (
            <Button variant="default" {...props}>
              Change Picture
            </Button>
          )}
        </FileButton>

        <Button
          onClick={handleUpload}
          loading={mutation.isPending}
          disabled={!image}
        >
          Upload
        </Button>
      </Group>
    </Modal>
  );
}
