"use client";

import { useMutation } from "@tanstack/react-query";
import { Button, Group, Modal, TextInput } from "@mantine/core";

import { authClient } from "@/lib/auth-client";
import { isNotEmpty, useForm } from "@mantine/form";

export interface UpdateNameModalProps {
  opened: boolean;
  onClose: () => void;
  defaultValue?: string;
}

export default function UpdateNameModal({
  opened,
  onClose,
  defaultValue = "",
}: UpdateNameModalProps) {
  const form = useForm({
    initialValues: {
      name: defaultValue,
    },
    validate: {
      name: isNotEmpty("Name is required"),
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
      form.setFieldError("name", error.message);
    },
  });

  return (
    <Modal
      title={<label htmlFor="name">Name</label>}
      opened={opened}
      onClose={onClose}
      centered
    >
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <Group align="start">
          <TextInput
            id="name"
            flex={1}
            placeholder="Enter your name"
            {...form.getInputProps("name")}
          />

          <Button
            type="submit"
            loading={mutation.isPending}
            disabled={!form.values.name}
          >
            Update
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
