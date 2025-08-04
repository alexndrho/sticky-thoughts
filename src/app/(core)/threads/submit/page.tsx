"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import {
  Button,
  Container,
  Group,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { authClient } from "@/lib/auth-client";
import { getQueryClient } from "@/lib/get-query-client";
import { threadInfiniteOptions } from "@/lib/query/options/thread";
import { THREAD_BODY_MAX_LENGTH } from "@/lib/validations/form";
import { submitThreadPost } from "@/services/thread";
import { useEffect } from "react";
import { useTiptapEditor } from "@/hooks/use-tiptap";
import TextEditor from "@/components/TextEditor";
import ServerError from "@/utils/error/ServerError";

export default function ThreadSubmitPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/");
    }
  }, [isSessionPending, session, router]);

  const form = useForm({
    initialValues: {
      title: "",
      body: "<p></p>",
    },
    validate: {
      title: (value) => {
        if (value.length < 1) return "Title is required";
        if (value.length > 100) {
          return `Title must be at most 100 characters long`;
        }
      },
      body: () => {
        if (editor?.isEmpty) {
          return "Body is required";
        } else if (
          (editor?.getText()?.trim().split(/\s+/).length ?? 0) >
          THREAD_BODY_MAX_LENGTH
        ) {
          return `Body must be at most ${THREAD_BODY_MAX_LENGTH.toLocaleString()} characters long`;
        }
      },
    },
  });

  const editor = useTiptapEditor({
    content: "<p></p>",
    placeholder: "Write your post...",
    onUpdate: ({ editor }) => {
      form.setFieldValue("body", editor.getHTML());
    },
    shouldRerenderOnTransaction: false,
  });

  const mutation = useMutation({
    mutationFn: submitThreadPost,
    onSuccess: ({ id }) => {
      getQueryClient().invalidateQueries({
        queryKey: threadInfiniteOptions.queryKey,
      });
      router.push(`/threads/post/${id}`);
    },
    onError: (error) => {
      if (error instanceof ServerError) {
        error.errors.forEach((err) => {
          if (err.code === "thread/title-already-exists") {
            form.setFieldError("title", err.message);
          } else {
            form.setFieldError("root", err.message);
          }
        });
      }
    },
  });

  return (
    <Container mx="auto" py="xl" px={0} size="sm">
      <Title mb="lg">Create post</Title>

      <form onSubmit={form.onSubmit((value) => mutation.mutate(value))}>
        <TextInput label="Title" {...form.getInputProps("title")} />

        <TextEditor editor={editor} error={form.errors.body} />

        {form.errors.root && (
          <Text mt="xs" size="xs" c="red.8">
            {form.errors.root}
          </Text>
        )}

        <Group mt="md" justify="end">
          <Button
            type="submit"
            loading={mutation.isPending}
            disabled={!form.isDirty()}
          >
            Submit
          </Button>
        </Group>
      </form>
    </Container>
  );
}
