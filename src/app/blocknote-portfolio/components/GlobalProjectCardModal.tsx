"use client";

import React, { useState, useEffect } from "react";
import ProjectCardModal from "./ProjectCardModal";
import { ProjectCardProps } from "./ProjectCardBlock";

export default function GlobalProjectCardModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<any>(null);
  const [currentEditor, setCurrentEditor] = useState<any>(null);

  useEffect(() => {
    const handleOpenModal = (event: any) => {
      const { block, editor } = event.detail;
      setCurrentBlock(block);
      setCurrentEditor(editor);
      setIsOpen(true);
    };

    document.addEventListener('openProjectCardModal', handleOpenModal);
    
    return () => {
      document.removeEventListener('openProjectCardModal', handleOpenModal);
    };
  }, []);

  const handleSave = (newProps: ProjectCardProps) => {
    if (currentEditor && currentBlock) {
      currentEditor.updateBlock(currentBlock.id, { props: newProps });
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentBlock(null);
    setCurrentEditor(null);
  };

  if (!currentBlock) return null;

  const blockProps = currentBlock.props as ProjectCardProps;

  return (
    <ProjectCardModal
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleSave}
      initialProps={{
        title: blockProps.title || "Project Title",
        imageUrl: blockProps.imageUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
        shortDescription: blockProps.shortDescription || [],
      }}
    />
  );
}
