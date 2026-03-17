
"use client"

import { useState, useCallback, useEffect } from "react"
import { type ComplexityMetrics, calculateComplexity } from "@/lib/complexity"

export type InferenceProvider = 'local' | 'anthropic' | 'openai' | 'gemini' | 'ollama';

export type FileItem = {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileItem[];
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
};

export interface AppState {
  code: string;
  isDiffOpen: boolean;
  proposedCode: string;
  originalMetrics: ComplexityMetrics | null;
  proposedMetrics: ComplexityMetrics | null;
  inferenceProvider: InferenceProvider;
  keyStatus: Record<string, boolean>;
  ollamaConfig: { url: string; model: string };
  fileTree: FileItem[];
  activeFilePath: string | null;
  isFetchingTree: boolean;
  isDirty: boolean;
  workspaceRoot: string | null;
}

export function useAppStore(initialCode: string) {
  const [state, setState] = useState<AppState>(() => {
    return {
      code: initialCode,
      isDiffOpen: false,
      proposedCode: "",
      originalMetrics: calculateComplexity(initialCode),
      proposedMetrics: null,
      inferenceProvider: 'local',
      keyStatus: {},
      ollamaConfig: { url: "http://127.0.0.1:11434", model: "qwen2.5-coder" },
      fileTree: [],
      activeFilePath: null,
      isFetchingTree: false,
      isDirty: false,
      workspaceRoot: null,
    };
  });

  const fetchWorkspaceTree = useCallback(async (path?: string) => {
    setState(prev => ({ ...prev, isFetchingTree: true }));
    try {
      const url = path ? `/api/workspace/tree?path=${encodeURIComponent(path)}` : '/api/workspace/tree';
      const response = await fetch(url);
      
      if (!response.ok) {
        setState(prev => ({ ...prev, isFetchingTree: false }));
        return;
      }

      const data = await response.json();
      setState(prev => ({ ...prev, fileTree: data, isFetchingTree: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isFetchingTree: false }));
    }
  }, []);

  const setWorkspaceRoot = useCallback(async (path: string) => {
    try {
      const response = await fetch('/api/workspace/set_root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });

      if (response.ok) {
        setState(prev => ({ ...prev, workspaceRoot: path }));
        await fetchWorkspaceTree(path);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, [fetchWorkspaceTree]);

  const resetWorkspaceRoot = useCallback(() => {
    setState(prev => ({ ...prev, workspaceRoot: null, fileTree: [] }));
  }, []);

  const openLocalFile = useCallback(async () => {
    try {
      // @ts-ignore
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Code Files',
            accept: {
              'text/plain': ['.ts', '.tsx', '.js', '.jsx', '.cpp', '.hpp', '.py', '.rs'],
            },
          },
        ],
      });
      
      const file = await handle.getFile();
      const content = await file.text();
      
      setState(prev => ({
        ...prev,
        code: content,
        activeFilePath: handle.name,
        originalMetrics: calculateComplexity(content),
        isDiffOpen: false,
        proposedCode: "",
        isDirty: false,
      }));
    } catch (err) {
      console.log("File selection cancelled");
    }
  }, []);

  const openFile = useCallback(async (path: string, handle?: FileSystemFileHandle) => {
    try {
      let content = "";
      if (handle) {
        const file = await handle.getFile();
        content = await file.text();
      } else {
        const response = await fetch(`/api/workspace/read?path=${encodeURIComponent(path)}`);
        if (!response.ok) return;
        content = await response.text();
      }
      
      setState(prev => ({
        ...prev,
        code: content,
        activeFilePath: path,
        originalMetrics: calculateComplexity(content),
        isDiffOpen: false,
        proposedCode: "",
        isDirty: false,
      }));
    } catch (err) {
      console.error("[WORKSPACE]: Error reading file", err);
    }
  }, []);

  const saveActiveFile = useCallback(async () => {
    if (!state.activeFilePath) return;
    try {
      const response = await fetch('/api/workspace/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: state.activeFilePath, content: state.code })
      });
      if (response.ok) {
        setState(prev => ({ ...prev, isDirty: false }));
      }
    } catch (err) {
      console.error("[WORKSPACE]: Save failed", err);
    }
  }, [state.activeFilePath, state.code]);

  const saveFileAs = useCallback(async (newPath: string) => {
    try {
      const response = await fetch('/api/workspace/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: newPath, content: state.code })
      });
      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          activeFilePath: newPath,
          isDirty: false 
        }));
        fetchWorkspaceTree(state.workspaceRoot || undefined);
      }
    } catch (err) {
      console.error("[WORKSPACE]: Save As failed", err);
    }
  }, [state.code, state.workspaceRoot, fetchWorkspaceTree]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [keyRes, configRes] = await Promise.all([
          fetch('/api/settings/keys/status'),
          fetch('/api/settings')
        ]);
        
        if (keyRes.ok) {
          const status = await keyRes.json();
          setState(prev => ({ ...prev, keyStatus: status }));
        }

        if (configRes.ok) {
          const config = await configRes.json();
          if (config.ollamaUrl || config.ollamaModel) {
            setState(prev => ({
              ...prev,
              ollamaConfig: {
                url: config.ollamaUrl || prev.ollamaConfig.url,
                model: config.ollamaModel || prev.ollamaConfig.model
              }
            }));
          }
        }
      } catch (e) {}
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveActiveFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveActiveFile]);

  const setInferenceProvider = useCallback((provider: InferenceProvider) => {
    setState(prev => ({ ...prev, inferenceProvider: provider }));
  }, []);

  const saveApiKey = useCallback(async (provider: string, key: string) => {
    try {
      const response = await fetch('/api/settings/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, key })
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          keyStatus: { ...prev.keyStatus, [provider]: true }
        }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, []);

  const saveOllamaConfig = useCallback(async (url: string, model: string) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ollamaUrl: url, ollamaModel: model })
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          ollamaConfig: { url, model }
        }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, []);

  const openDiff = useCallback((refactoredCode: string) => {
    setState(prev => ({
      ...prev,
      proposedCode: refactoredCode,
      isDiffOpen: true,
      proposedMetrics: calculateComplexity(refactoredCode),
    }));
  }, []);

  const acceptRefactor = useCallback(() => {
    setState(prev => ({
      ...prev,
      code: prev.proposedCode,
      isDiffOpen: false,
      proposedCode: "",
      originalMetrics: prev.proposedMetrics,
      proposedMetrics: null,
      isDirty: true,
    }));
  }, []);

  const rejectRefactor = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDiffOpen: false,
      proposedCode: "",
      proposedMetrics: null,
    }));
  }, []);

  const setCode = useCallback((newCode: string) => {
    setState(prev => ({
      ...prev,
      code: newCode,
      originalMetrics: calculateComplexity(newCode),
      isDirty: true,
    }));
  }, []);

  return {
    ...state,
    setCode,
    openDiff,
    acceptRefactor,
    rejectRefactor,
    setInferenceProvider,
    saveApiKey,
    saveOllamaConfig,
    fetchWorkspaceTree,
    setWorkspaceRoot,
    resetWorkspaceRoot,
    openFile,
    saveActiveFile,
    saveFileAs,
    openLocalFile,
  };
}
