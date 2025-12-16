import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] p-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      },
    },
  });

  return (
    <div className={`rich-text-editor ${className || ""}`}>
      <style jsx global>{`
        .rich-text-editor ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-text-editor ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-text-editor ul li {
          list-style-type: disc;
          margin-bottom: 0.25rem;
        }
        .rich-text-editor ol li {
          list-style-type: decimal;
          margin-bottom: 0.25rem;
        }
        .rich-text-editor li p {
          margin: 0;
        }
      `}</style>
      <EditorContent editor={editor} />
      {editor && !editor.isEmpty && placeholder && (
        <div className="text-muted-foreground absolute top-3 left-3 pointer-events-none">
          {placeholder}
        </div>
      )}
      {editor && (
        <div className="flex items-center gap-2 mt-2 p-1 border-t">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1 rounded hover:bg-gray-100 ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="Negrita"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1 rounded hover:bg-gray-100 ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="Cursiva"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1 rounded hover:bg-gray-100 ${
              editor.isActive("underline") ? "bg-gray-200" : ""
            }`}
            title="Subrayado"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-1 rounded hover:bg-gray-100 ${
              editor.isActive("paragraph") ? "bg-gray-200" : ""
            }`}
            title="Párrafo"
          >
            <span>P</span>
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-1 rounded hover:bg-gray-100 ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
            }`}
            title="Encabezado"
          >
            <span>H2</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1 rounded hover:bg-gray-100 ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="Lista con viñetas"
          >
            • Lista
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1 rounded hover:bg-gray-100 ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="Lista numerada"
          >
            1. Lista
          </button>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
