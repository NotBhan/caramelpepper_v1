
"use client"

import { useState, useCallback, useEffect } from "react"
import { type ComplexityMetrics, calculateComplexity } from "@/lib/complexity"

export type InferenceProvider = 'local' | 'anthropic' | 'openai' | 'gemini';

export type FileItem = {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileItem[];
};

export interface AppState {
  code: string;
  isDiffOpen: boolean;
  proposedCode: string;
  originalMetrics: ComplexityMetrics | null;
  proposedMetrics: ComplexityMetrics | null;
  inferenceProvider: InferenceProvider;
  keyStatus: Record<string, boolean>;
  fileTree: FileItem[];
  activeFilePath: string | null;
  isFetchingTree: boolean;
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
      fileTree: [],
      activeFilePath: null,
      isFetchingTree: false,
    };
  });

  const fetchWorkspaceTree = useCallback(async () => {
    setState(prev => ({ ...prev, isFetchingTree: true }));
    try {
      const response = await fetch('/api/workspace/tree');
      
      if (!response.ok) {
        console.warn(`[WORKSPACE]: Backend unreachable (Status ${response.status}). Ensure CaramelPepper backend is running.`);
        setState(prev => ({ ...prev, fileTree: [], isFetchingTree: false }));
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setState(prev => ({ ...prev, fileTree: [], isFetchingTree: false }));
        return;
      }

      const data = await response.json();
      setState(prev => ({ ...prev, fileTree: data, isFetchingTree: false }));
    } catch (err) {
      console.error("[WORKSPACE]: Connection failed", err);
      setState(prev => ({ ...prev, fileTree: [], isFetchingTree: false }));
    }
  }, []);

  const openFile = useCallback(async (path: string) => {
    try {
      const response = await fetch(`/api/workspace/read?path=${encodeURIComponent(path)}`);
      
      if (!response.ok) {
        console.warn(`[WORKSPACE]: Failed to read file ${path} (Status ${response.status})`);
        return;
      }

      const content = await response.text();
      
      if (content.startsWith("ERROR:")) {
        console.error("[WORKSPACE]: Backend error", content);
        return;
      }
      
      setState(prev => ({
        ...prev,
        code: content,
        activeFilePath: path,
        originalMetrics: calculateComplexity(content),
        isDiffOpen: false,
        proposedCode: "",
      }));
    } catch (err) {
      console.error("[WORKSPACE]: Connection error reading file", err);
    }
  }, []);

  useEffect(() => {
    const savedProvider = localStorage.getItem('cp_inference_provider') as InferenceProvider;
    
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/settings/keys/status');
        let mockStatus = {
          openai: false,
          anthropic: false,
          gemini: false,
          local: true
        };

        if (response.ok) {
          const status = await response.json();
          mockStatus = { ...mockStatus, ...status };
        }
        
        setState(prev => ({
          ...prev,
          inferenceProvider: savedProvider || 'local',
          keyStatus: mockStatus,
        }));
      } catch (e) {
        console.warn("[INIT]: Could not fetch key status, using defaults");
      }

      fetchWorkspaceTree();
    };

    fetchInitialData();
  }, [fetchWorkspaceTree]);

  const setInferenceProvider = useCallback((provider: InferenceProvider) => {
    setState(prev => {
      localStorage.setItem('cp_inference_provider', provider);
      return { ...prev, inferenceProvider: provider };
    });
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
      console.error("[VAULT]: Failed to save key", err);
      return false;
    }
  }, []);

  const openDiff = useCallback((refactoredCode: string) => {
    const originalMetrics = calculateComplexity(state.code);
    const proposedMetrics = calculateComplexity(refactoredCode);
    
    setState(prev => ({
      ...prev,
      proposedCode: refactoredCode,
      isDiffOpen: true,
      originalMetrics,
      proposedMetrics,
    }));
  }, [state.code]);

  const acceptRefactor = useCallback(() => {
    setState(prev => ({
      ...prev,
      code: prev.proposedCode,
      isDiffOpen: false,
      proposedCode: "",
      originalMetrics: prev.proposedMetrics,
      proposedMetrics: null,
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
    fetchWorkspaceTree,
    openFile,
  };
}
