"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
export type ProjectCardProps = {
  title: string;
  imageUrl: string;
  shortDescription: any[]; 
};

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

interface ProjectCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (props: ProjectCardProps) => void;
  initialProps: ProjectCardProps;
}

export default function ProjectCardModal({
  isOpen,
  onClose,
  onSave,
  initialProps,
}: ProjectCardModalProps) {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState<ProjectCardProps>({
    title: initialProps.title,
    imageUrl: initialProps.imageUrl,
    shortDescription: initialProps.shortDescription || [],
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const schema = useMemo(
    () =>
      BlockNoteSchema.create({
        blockSpecs: { ...defaultBlockSpecs },
      }),
    []
  );

  const editor = useCreateBlockNote({
    schema,
    initialContent: formData.shortDescription.length > 0 
      ? formData.shortDescription 
      : [
          {
            type: "paragraph",
            content: "Add a short description of your project...",
          },
        ],
  });

  useEffect(() => {
    setFormData({
      title: initialProps.title,
      imageUrl: initialProps.imageUrl,
      shortDescription: initialProps.shortDescription || [],
    });
    try {
      const nextContent = (initialProps.shortDescription || []) as any;
      if (Array.isArray(nextContent) && nextContent.length > 0) {
        editor.replaceBlocks(editor.document, nextContent);
      }
    } catch {}
  }, [initialProps]);

  if (!isOpen || !isClient) return null;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const next: ProjectCardProps = {
      ...formData,
      shortDescription: editor.document,
    };
    onSave(next);
    onClose();
  }, [formData, editor, onSave, onClose]);


  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-[9999]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl lg:max-w-3xl mx-0 sm:mx-4 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-3 sm:p-4 md:p-6 border-b">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Edit Project Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Image
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const result = reader.result as string;
                    setFormData({ ...formData, imageUrl: result });
                  };
                  reader.readAsDataURL(file);
                }}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to ~5MB. The image is embedded in your document.</p>
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop";
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <div className="border border-gray-300 rounded-md p-1 sm:p-2 min-h-[100px] sm:min-h-[120px] md:min-h-[140px]">
              <BlockNoteView
                editor={editor}
                theme="light"
                className="prose max-w-none text-sm sm:text-base"
              />
            </div>
          </div>



          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 order-1 sm:order-2"
            >
              Save Project Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
