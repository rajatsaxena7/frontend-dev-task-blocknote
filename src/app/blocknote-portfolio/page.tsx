"use client";

import dynamic from "next/dynamic";

// Dynamic import to ensure BlockNote only loads on client-side
const BlockNoteEditor = dynamic(() => import("./components/BlockNoteEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  ),
});

export default function BlockNotePortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BlockNote Portfolio Editor
          </h1>
          <p className="text-gray-600">
            A simple BlockNote editor with basic blocks. Start building your portfolio!
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <BlockNoteEditor />
        </div>
      </div>
    </div>
  );
}
