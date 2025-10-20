"use client";

import { useState } from 'react';

interface SaveButtonProps {
  onSave: () => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  lastSaved: Date | null;
  className?: string;
}

export default function SaveButton({
  onSave,
  isLoading,
  isSuccess,
  error,
  lastSaved,
  className = "",
}: SaveButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    try {
      await onSave();
      if (isSuccess) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
    }
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={handleSave}
        disabled={isLoading}
        className={`
          px-4 py-2 rounded-md font-medium text-sm transition-all duration-200
          ${isLoading 
            ? 'bg-gray-400 text-white cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }
          ${showSuccess ? 'animate-pulse bg-green-600' : ''}
        `}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </div>
        ) : showSuccess ? (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Saved!
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Content
          </div>
        )}
      </button>

      <div className="flex flex-col text-xs text-gray-500">
        {error && (
          <span className="text-red-600 font-medium">
            Error: {error}
          </span>
        )}
        {lastSaved && !error && (
          <span className="text-gray-500">
            Last saved: {formatLastSaved(lastSaved)}
          </span>
        )}
      </div>
    </div>
  );
}
