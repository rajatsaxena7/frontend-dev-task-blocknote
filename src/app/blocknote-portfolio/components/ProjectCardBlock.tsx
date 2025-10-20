"use client";

import React from "react";
import { createBlockSpec } from "@blocknote/core";

export type ProjectCardProps = {
  title: string;
  imageUrl: string;
  shortDescription: any[]; 
};

const ProjectCard = (block: any, editor: any) => {
  const props = block.props as ProjectCardProps;
  
  const container = document.createElement('div');
  container.className = 'project-card group relative w-full max-w-xl mx-auto bg-white rounded-lg shadow border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow';
  
  container.addEventListener('click', () => {
    const event = new CustomEvent('openProjectCardModal', {
      detail: { block, editor }
    });
    document.dispatchEvent(event);
  });
  
  const deriveDescriptionPreview = (blocks: any[]): string => {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return 'Short description with BlockNote editor - click to edit';
    }
    const firstTextBlock = blocks.find((b: any) =>
      typeof b?.content === 'string' && b.content.trim().length > 0
    ) || blocks.find((b: any) => Array.isArray(b?.content) && b.content.length > 0);

    if (!firstTextBlock) {
      return 'Short description with BlockNote editor - click to edit';
    }

    if (typeof firstTextBlock.content === 'string') {
      return firstTextBlock.content;
    }

    try {
      const text = firstTextBlock.content
        .map((n: any) => (typeof n?.text === 'string' ? n.text : ''))
        .join('')
        .trim();
      return text || 'Short description with BlockNote editor - click to edit';
    } catch {
      return 'Short description with BlockNote editor - click to edit';
    }
  };

  const descriptionPreview = deriveDescriptionPreview(props.shortDescription as any);

  container.innerHTML = `
    <div class="relative">
        <img 
          src="${props.imageUrl}" 
          alt="${props.title || 'Project image'}" 
          class="w-full h-40 sm:h-48 md:h-56 object-cover rounded-t-lg"
          onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop'"
        />
      <div class="absolute top-2 right-2 flex gap-2">
        <div class="bg-white/90 px-2 py-0.5 rounded text-xs text-gray-600 border">
          /Project Card
        </div>
        <button class="hidden group-hover:inline-flex items-center gap-1 bg-blue-600 text-white text-xs px-2 py-1 rounded border border-blue-700">
          ✎ Edit
        </button>
      </div>
    </div>
    <div class="p-5">
      <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 line-clamp-1">
        ${props.title || 'Project Title'}
      </h3>
      <div class="text-gray-600 text-sm">
        <p>${descriptionPreview}</p>
      </div>
    </div>
  `;
  
  return {
    dom: container,
    contentDOM: undefined,
    destroy: () => {},
    ignoreMutation: () => true,
  };
};

export const ProjectCardSpec = createBlockSpec(
  {
    type: "projectCard",
    propSchema: {
      title: { default: "Project Title" },
      imageUrl: {
        default:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
      },
      shortDescription: { default: [] as any },
    },
    content: "none",
  },
  {
    render: ProjectCard,
    parse: () => ({}),
     toExternalHTML: (block: any) => {
       const { title, imageUrl } = (block.props as ProjectCardProps) || {};
       const container = document.createElement('figure');
       container.className = 'project-card-export';
       container.innerHTML = `
         <img src="${imageUrl}" alt="${title}" />
         <figcaption>
           <strong>${title}</strong>
           <p>Project description with BlockNote content</p>
         </figcaption>
       `;
       return {
         dom: container,
         contentDOM: undefined,
       };
     },
  }
);
