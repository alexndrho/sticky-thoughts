import { useCallback, useMemo } from "react";
import {
  useEditor,
  type Content,
  type Editor,
  type UseEditorOptions,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorState } from "@tiptap/pm/state";

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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createTiptapExtensions(placeholder),
    onCreate: ({ editor }) => handleCreate(editor),
    ...props,
  });

  const setNewContentState = useCallback(
    (content: Content) => {
      if (!editor || editor.isDestroyed) return;

      editor.commands.setContent(content);

      const newEditorState = EditorState.create({
        doc: editor.state.doc,
        plugins: editor.state.plugins,
        schema: editor.state.schema,
      });
      editor.view.updateState(newEditorState);
    },
    [editor],
  );

  return useMemo(
    () => ({ editor, setNewContentState }),
    [editor, setNewContentState],
  );
};
