import { useCallback, useEffect } from "react";
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
  // debounceDelay?: number;
  // onBlur?: (content: Content) => void;
}

const createTiptapExtensions = (placeholder: string) => [
  StarterKit.configure({
    heading: {
      levels: [2],
    },
  }),
  Link.configure({
    HTMLAttributes: {
      target: null,
    },
  }),
  Placeholder.configure({ placeholder }),
];

export const useTiptapEditor = ({
  value,
  editable = true,
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

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.options.editable = editable;
      editor.view.update(editor.view.props);

      if (editable) {
        editor.view.dom.focus();
      } else {
        editor.commands.blur();
      }
    }
  }, [editor, editable]);

  return editor;
};

export const setTiptapEditable = (editor: Editor, editable: boolean) => {
  if (editor.isDestroyed) return;

  editor.options.editable = editable;
  editor.view.update(editor.view.props);

  if (editable) {
    editor.view.dom.focus();
  } else {
    editor.commands.blur();
  }
};

export const setTiptapNewContentState = (editor: Editor, content: Content) => {
  if (editor.isDestroyed) return;

  editor.commands.setContent(content);

  const newEditorState = EditorState.create({
    doc: editor.state.doc,
    plugins: editor.state.plugins,
    schema: editor.state.schema,
  });
  editor.view.updateState(newEditorState);
};
