"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { Button, Group, Modal, TextInput } from "@mantine/core";

import { authClient } from "@/lib/auth-client";

export interface UpdateUsernameModalProps {
  opened: boolean;
  onClose: () => void;
  defaultValue?: string;
}

export default function UpdateUsernameModal({
  opened,
  onClose,
  defaultValue = "",
}: UpdateUsernameModalProps) {
  const form = useForm({
    initialValues: {
      username: defaultValue,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: typeof form.values) => authClient.updateUser(values),
    onSuccess: ({ error }) => {
      if (error) {
        form.setFieldError("root", error.message);
        return;
      }

      form.reset();
      onClose();
    },
    onError: (error) => {
      form.setFieldError("username", error.message);
    },
  });

  return (
    <Modal
      title={<label htmlFor="username">Username</label>}
      opened={opened}
      onClose={onClose}
      centered
    >
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <Group align="start">
          <TextInput
            id="username"
            flex={1}
            placeholder="Enter your username"
            {...form.getInputProps("username")}
          />

          <Button
            type="submit"
            loading={mutation.isPending}
            disabled={!form.values.username}
          >
            Update
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
