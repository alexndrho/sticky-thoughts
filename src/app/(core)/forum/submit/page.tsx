"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { RichTextEditor, Link } from "@mantine/tiptap";
import {
  Button,
  Container,
  Group,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { authClient } from "@/lib/auth-client";
import { submitForum } from "@/services/forum";
import { FORM_BODY_MAX_LENGTH } from "@/lib/validations/form";
import { useEffect } from "react";

export default function ForumSubmitPage() {
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
          FORM_BODY_MAX_LENGTH
        ) {
          return `Body must be at most ${FORM_BODY_MAX_LENGTH.toLocaleString()} characters long`;
        }
      },
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        HTMLAttributes: {
          target: null,
        },
      }),
      Placeholder.configure({ placeholder: "Body" }),
    ],
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      form.setFieldValue("body", editor.getHTML());
    },
    content: "<p></p>",
  });

  const mutation = useMutation({
    mutationFn: submitForum,
    onSuccess: ({ id }) => {
      router.push(`/forum/post/${id}`);
    },
    onError: (error) => {
      if (error instanceof Error) {
        form.setFieldError("root", error.message);
      }
    },
  });

  return (
    <Container mx="auto" py="xl" px={0} size="sm">
      <Title mb="lg">Create post</Title>

      <form onSubmit={form.onSubmit((value) => mutation.mutate(value))}>
        <TextInput label="Title" {...form.getInputProps("title")} />

        <RichTextEditor
          mt="md"
          editor={editor}
          style={{
            borderColor: form.errors.body
              ? "var(--mantine-color-error)"
              : undefined,
          }}
        >
          <RichTextEditor.Toolbar
            sticky
            style={{
              borderColor: form.errors.body
                ? "var(--mantine-color-error)"
                : undefined,
            }}
          >
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link
                styles={{
                  linkEditorInput: {
                    padding: 0,
                  },
                  linkEditorExternalControl: {
                    display: "none",
                  },
                }}
              />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>

        {form.errors.body && (
          <Text size="xs" c="red.8" mt={5}>
            {form.errors.body}
          </Text>
        )}

        {form.errors.root && (
          <Text mt="xs" size="xs" c="red.8">
            {form.errors.root}
          </Text>
        )}

        <Group mt="md" justify="end">
          <Button type="submit" loading={mutation.isPending}>
            Submit
          </Button>
        </Group>
      </form>
    </Container>
  );
}
