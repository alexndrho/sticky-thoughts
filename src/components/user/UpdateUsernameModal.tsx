"use client";

import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { useForm, zodResolver } from "@mantine/form";
import { Button, Group, Modal, TextInput } from "@mantine/core";
import type { User } from "@prisma/client";

import { updateUsernameInput } from "@/lib/validations/user";
import { updateUsername } from "@/services/user";
import { getQueryClient } from "@/app/providers";
import ServerError from "@/utils/error/ServerError";

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
  const { data: session } = useSession();

  const form = useForm({
    initialValues: {
      username: defaultValue,
    },
    validate: zodResolver(updateUsernameInput),
  });

  const mutation = useMutation({
    mutationFn: async (values: typeof form.values) =>
      await updateUsername(values.username),
    onSuccess: () => {
      getQueryClient().setQueryData(
        ["settings", session?.user?.id],
        (oldData: User | undefined) =>
          oldData
            ? {
                ...oldData,
                username: form.values.username,
              }
            : oldData,
      );

      form.reset();
      onClose();
    },
    onError: (error) => {
      if (error instanceof ServerError) {
        form.setFieldError("username", error.issues.errors[0].message);
        return;
      }

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

          <Button type="submit">Update</Button>
        </Group>
      </form>
    </Modal>
  );
}
