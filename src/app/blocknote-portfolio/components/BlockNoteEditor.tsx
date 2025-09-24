"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function BlockNoteEditor() {
  // Creates a new editor instance with basic blocks only
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        props: {
          level: 1,
        },
        content: "Welcome to BlockNote Editor",
      },
      {
        type: "paragraph",
        content: "This is a simple paragraph. You can start typing here to create your portfolio content.",
      },
      {
        type: "heading",
        props: {
          level: 2,
        },
        content: "Getting Started",
      },
      {
        type: "paragraph",
        content: "Use the '/' command to see available blocks, or click the '+' button to add new content.",
      },
      {
        type: "heading",
        props: {
          level: 2,
        },
        content: "Your Task",
      },
      {
        type: "paragraph",
        content: "Build a custom Project Card block that can be edited in a modal. This will test your ability to work with BlockNote's custom block system and React state management.",
      },
    ],
  });

  return (
    <div className="min-h-[400px]">
      <BlockNoteView 
        editor={editor} 
        theme="light"
        className="prose max-w-none"
      />
    </div>
  );
}
