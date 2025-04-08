import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import type { User } from "@prisma/client";
import { Button, Group, Modal, TextInput } from "@mantine/core";

import { getQueryClient } from "@/app/providers";
import { useForm, zodResolver } from "@mantine/form";
import { updateName } from "@/services/user";
import { updateNameInput } from "@/lib/validations/user";

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
  const { data: session, update: updateSession } = useSession();

  const form = useForm({
    initialValues: {
      name: defaultValue,
    },
    validate: zodResolver(updateNameInput),
  });

  const mutation = useMutation({
    mutationFn: async (values: typeof form.values) =>
      await updateName(values.name),
    onSuccess: () => {
      updateSession({
        ...session,
        user: {
          ...session?.user,
          name: form.values.name,
        },
      });

      getQueryClient().setQueryData(
        ["settings", session?.user?.id],
        (oldData: User | undefined) =>
          oldData
            ? {
                ...oldData,
                name: form.values.name,
              }
            : oldData,
      );

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
