"use client";

import { useForm, zodResolver } from "@mantine/form";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { type Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Button,
  Container,
  Flex,
  Group,
  TextInput,
  Title,
} from "@mantine/core";

import { createForumInput } from "@/lib/validations/forum";

export default function Forum() {
  // const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      title: "",
      body: "",
    },
    validate: zodResolver(createForumInput),
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: "Body" }),
    ],
    content: "",

    onUpdate: ({ editor }: { editor: Editor }) => {
      form.setFieldValue("body", editor.getHTML());
    },
  });

  return (
    <Container size="sm" px="0" py="lg">
      <Title order={1} size="h2" mb="md">
        Create post
      </Title>

      <form onSubmit={form.onSubmit(console.log)}>
        <Flex direction="column" gap="md">
          <TextInput
            label="Title"
            withAsterisk
            {...form.getInputProps("title")}
          />

          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar>
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
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>

          <Group justify="end">
            <Button type="submit">Submit</Button>
          </Group>
        </Flex>
      </form>
    </Container>
  );
}
