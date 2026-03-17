
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
      // [SIMULATED]: In production, calls GET /api/workspace/tree
      const response = await fetch('/api/workspace/tree');
      const data = await response.json();
      setState(prev => ({ ...prev, fileTree: data, isFetchingTree: false }));
    } catch (err) {
      console.error("Failed to fetch workspace tree", err);
      setState(prev => ({ ...prev, isFetchingTree: false }));
    }
  }, []);

  const openFile = useCallback(async (path: string) => {
    try {
      // [SIMULATED]: In production, calls GET /api/workspace/read?path=...
      const response = await fetch(`/api/workspace/read?path=${encodeURIComponent(path)}`);
      const content = await response.text();
      
      setState(prev => ({
        ...prev,
        code: content,
        activeFilePath: path,
        originalMetrics: calculateComplexity(content),
        isDiffOpen: false,
        proposedCode: "",
      }));
    } catch (err) {
      console.error("Failed to read file", err);
    }
  }, []);

  useEffect(() => {
    const savedProvider = localStorage.getItem('cp_inference_provider') as InferenceProvider;
    
    const fetchInitialData = async () => {
      // Fetch initial key status
      const mockStatus = {
        openai: false,
        anthropic: false,
        gemini: false,
        local: true
      };
      
      setState(prev => ({
        ...prev,
        inferenceProvider: savedProvider || 'local',
        keyStatus: mockStatus,
      }));

      // Fetch file tree
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
    console.log(`[VAULT]: Sending key for ${provider} to backend vault...`);
    setState(prev => ({
      ...prev,
      keyStatus: { ...prev.keyStatus, [provider]: true }
    }));
    return true;
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
