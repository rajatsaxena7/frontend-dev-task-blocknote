"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote, SuggestionMenuController } from "@blocknote/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { ProjectCardSpec } from "./ProjectCardBlock";
import GlobalProjectCardModal from "./GlobalProjectCardModal";
import { useContentManager } from "../hooks/useContentManager";
import SaveButton from "./SaveButton";

export default function BlockNoteEditor() {
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const schema = useMemo(() => (
    BlockNoteSchema.create({
      blockSpecs: {
        ...defaultBlockSpecs,
        projectCard: ProjectCardSpec,
      },
    })
  ), []);

  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      { type: "heading", props: { level: 1 }, content: "Welcome" },
      { type: "paragraph", content: "" },
    ],
  });

  const { saveContent, saveState } = useContentManager({
    editor: editor as any, 
    contentId: 'portfolio-content',
    autoSave: true,
    autoSaveInterval: 30000, 
  });

  const projectCardItem = useMemo(() => {
    if (!editor) return null;
    return {
      title: "Project Card",
      group: "Custom",
      aliases: ["project", "portfolio", "card", "pr"],
      subtext: "Insert an editable project card (image, title, description).",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <rect x="6" y="8" width="6" height="2" />
          <rect x="6" y="12" width="10" height="2" />
        </svg>
      ),
      onItemClick: () => {
        editor.insertBlocks(
          [
            {
              type: "projectCard",
              props: {
                title: "Awesome Project",
                imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
                shortDescription: [] as any,
              },
            },
          ],
          editor.getTextCursorPosition().block,
          "after"
        );
      },
    };
  }, [editor]);

  const getItems = useCallback(async (query: string) => {
    if (!editor) return [];
    const defaultItems = [
      {
        title: "Heading 1",
        group: "Basic",
        aliases: ["h1", "heading1"],
        subtext: "Large heading",
        icon: <span className="text-lg font-bold">H1</span>,
        onItemClick: () => {
          editor.insertBlocks([{ type: "heading", props: { level: 1 }, content: "Heading 1" }], editor.getTextCursorPosition().block, "after");
        },
      },
      {
        title: "Heading 2", 
        group: "Basic",
        aliases: ["h2", "heading2"],
        subtext: "Medium heading",
        icon: <span className="text-base font-bold">H2</span>,
        onItemClick: () => {
          editor.insertBlocks([{ type: "heading", props: { level: 2 }, content: "Heading 2" }], editor.getTextCursorPosition().block, "after");
        },
      },
      {
        title: "Paragraph",
        group: "Basic", 
        aliases: ["p", "text"],
        subtext: "Plain text paragraph",
        icon: <span className="text-sm">P</span>,
        onItemClick: () => {
          editor.insertBlocks([{ type: "paragraph", content: "New paragraph" }], editor.getTextCursorPosition().block, "after");
        },
      },
      {
        title: "Bullet List",
        group: "Basic",
        aliases: ["ul", "list", "bullet"],
        subtext: "Unordered list",
        icon: <span className="text-sm">•</span>,
        onItemClick: () => {
          editor.insertBlocks([{ type: "bulletListItem", content: "List item" }], editor.getTextCursorPosition().block, "after");
        },
      },
      {
        title: "Numbered List",
        group: "Basic",
        aliases: ["ol", "numbered", "ordered"],
        subtext: "Ordered list", 
        icon: <span className="text-sm">1.</span>,
        onItemClick: () => {
          editor.insertBlocks([{ type: "numberedListItem", content: "List item" }], editor.getTextCursorPosition().block, "after");
        },
      },
    ];
    
    const customItems = projectCardItem ? [projectCardItem] : [];
    
    const allItems = [...defaultItems, ...customItems];
    if (!query) return allItems;
    
    return allItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.aliases.some(alias => alias.toLowerCase().includes(query.toLowerCase()))
    );
  }, [editor, projectCardItem]);

  const handleExportToPDF = useCallback(async () => {
    if (!editorRef.current) return;
    const canvas = await html2canvas(editorRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("blocknote-export.pdf");
      return;
    }

    let remainingHeight = imgHeight;
    let y = 0;
    const pageCanvas = document.createElement("canvas");
    const pageCtx = pageCanvas.getContext("2d");
    const pageHeightPx = (pageHeight * canvas.width) / pageWidth;
    pageCanvas.width = canvas.width;
    pageCanvas.height = pageHeightPx;

    while (remainingHeight > 0 && pageCtx) {
      pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(
        canvas,
        0,
        y,
        canvas.width,
        Math.min(pageHeightPx, canvas.height - y),
        0,
        0,
        pageCanvas.width,
        Math.min(pageHeightPx, canvas.height - y)
      );
      const pageImgData = pageCanvas.toDataURL("image/png");
      pdf.addImage(pageImgData, "PNG", 0, 0, pageWidth, pageHeight);
      remainingHeight -= pageHeight;
      y += pageHeightPx;
      if (remainingHeight > 0) pdf.addPage();
    }

    pdf.save("blocknote-export.pdf");
  }, []);


  if (!isClient) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] w-full">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6 mb-4">
        <div className="flex items-center justify-between">
          <SaveButton
            onSave={saveContent}
            isLoading={saveState.isLoading}
            isSuccess={saveState.isSuccess}
            error={saveState.error}
            lastSaved={saveState.lastSaved}
            className="justify-end"
          />
          <button
            onClick={handleExportToPDF}
            className="px-4 py-2 rounded-md font-medium text-sm bg-gray-800 text-white hover:bg-gray-900"
          >
            Export to PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
        <div ref={editorRef}>
          <BlockNoteView editor={editor} theme="light" className="prose max-w-none text-sm sm:text-base" slashMenu={false}>
          <SuggestionMenuController triggerCharacter="/" getItems={getItems} />
          </BlockNoteView>
        </div>
      </div>
      
      <GlobalProjectCardModal />
    </div>
  );
}
