"use client";

import { useState } from "react";
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
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: async () => {
      refetchSession();

      onClose();

      setImage(null);
      setError(null);
    },
    onError: (err) => {
      if (err instanceof ServerError) {
        setError(err.errors[0].message);
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
          src={image ? URL.createObjectURL(image) : undefined}
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
