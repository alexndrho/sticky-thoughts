import { useCallback } from "react";
import {
  useEditor,
  type Content,
  type Editor,
  type UseEditorOptions,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

export interface UseTiptapEditorProps extends UseEditorOptions {
  value?: Content;
  placeholder?: string;
}

const createTiptapExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: {
      levels: [2],
    },
  }),
  Link.configure({
    HTMLAttributes: {
      target: "_blank",
      rel: "noopener noreferrer",
    },
  }),
  Placeholder.configure({ placeholder }),
];

export const useTiptapEditor = ({
  value,
  placeholder = "",
  ...props
}: UseTiptapEditorProps) => {
  const handleCreate = useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value);
      }
    },
    [value],
  );

  return useEditor({
    immediatelyRender: false,
    extensions: createTiptapExtensions(placeholder),
    onCreate: ({ editor }) => handleCreate(editor),
    ...props,
  });
};
