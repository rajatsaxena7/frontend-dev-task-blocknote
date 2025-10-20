"use client";

import { useCallback, useEffect, useState } from 'react';
import { BlockNoteEditor } from '@blocknote/core';

interface SaveState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  lastSaved: Date | null;
}

interface UseContentManagerOptions {
  editor: any; 
  contentId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number; 
}

export function useContentManager({
  editor,
  contentId = 'default',
  autoSave = true,
  autoSaveInterval = 30000, 
}: UseContentManagerOptions) {
  const [saveState, setSaveState] = useState<SaveState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    lastSaved: null,
  });

  const serializeContent = useCallback(() => {
    if (!editor) return null;
    
    try {
      const document = editor.document;
      return JSON.stringify(document, null, 2);
    } catch (error) {
      console.error('Error serializing content:', error);
      return null;
    }
  }, [editor]);

  const deserializeContent = useCallback((contentString: string) => {
    try {
      return JSON.parse(contentString);
    } catch (error) {
      console.error('Error deserializing content:', error);
      return null;
    }
  }, []);

  const saveToAPI = useCallback(async (content: string) => {
    setSaveState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          id: contentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }

      const result = await response.json();
      
      setSaveState({
        isLoading: false,
        isSuccess: true,
        error: null,
        lastSaved: new Date(),
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSaveState({
        isLoading: false,
        isSuccess: false,
        error: errorMessage,
        lastSaved: null,
      });
      throw error;
    }
  }, [contentId]);

  const saveToLocalStorage = useCallback((content: string) => {
    try {
      const key = `blocknote-content-${contentId}`;
      localStorage.setItem(key, content);
      console.log('Content saved to localStorage:', key);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [contentId]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const key = `blocknote-content-${contentId}`;
      const content = localStorage.getItem(key);
      return content;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }, [contentId]);

  const loadFromAPI = useCallback(async () => {
    try {
      const response = await fetch(`/api/save-content?id=${contentId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.statusText}`);
      }

      const result = await response.json();
      return result.content;
    } catch (error) {
      console.error('Error loading from API:', error);
      return null;
    }
  }, [contentId]);

  const saveContent = useCallback(async () => {
    if (!editor) return;

    const content = serializeContent();
    if (!content) return;

    try {
      await saveToAPI(content);
    } catch (error) {
      console.warn('API save failed, using localStorage fallback:', error);
      saveToLocalStorage(content);
    }
  }, [editor, serializeContent, saveToAPI, saveToLocalStorage]);

  const loadContent = useCallback(async () => {
    if (!editor) return;

    let content = loadFromLocalStorage();
    
    if (!content) {
      content = await loadFromAPI();
    }

    if (content) {
      const parsedContent = deserializeContent(content);
      if (parsedContent) {
        editor.replaceBlocks(editor.document, parsedContent);
      }
    }
  }, [editor, loadFromLocalStorage, loadFromAPI, deserializeContent]);

  useEffect(() => {
    if (!autoSave || !editor) return;

    const interval = setInterval(() => {
      saveContent();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, saveContent, editor]);

  useEffect(() => {
    if (editor) {
      loadContent();
    }
  }, [editor, loadContent]);

  return {
    saveContent,
    loadContent,
    serializeContent,
    saveState,
    saveToLocalStorage,
    loadFromLocalStorage,
    saveToAPI,
    loadFromAPI,
  };
}
