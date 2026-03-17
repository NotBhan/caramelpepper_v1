"use client"

import { useState, useCallback, useEffect } from "react"
import { type ComplexityMetrics, calculateComplexity } from "@/lib/complexity"
import { MOCK_FILE_TREE } from "./mock-data"

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

const COMPLEX_TEST_CODE = `function handleRequest(req: any, res: any) {
  const data = req.body;
  
  if (data && data.user) {
    if (data.user.isAdmin) {
      if (data.action === 'delete') {
        return performDelete(data.id);
      } else if (data.action === 'update') {
        return performUpdate(data.id, data.payload);
      } else {
        return res.status(400).send("Invalid action");
      }
    } else {
      if (data.action === 'read') {
        return performRead(data.id);
      } else {
        return res.status(403).send("Forbidden");
      }
    }
  } else {
    return res.status(401).send("Unauthorized");
  }

  // High complexity loop
  const results = data.items.map(item => {
    if (item.valid) {
      return item.value > 10 ? item.value * 2 : item.value + 5;
    }
    return null;
  }).filter(val => val !== null);

  for (let i = 0; i < results.length; i++) {
    while (results[i] < 100) {
      results[i] *= 1.1;
      if (results[i] > 50 && results[i] < 60) {
        console.log("Mid range reached");
      }
    }
  }

  try {
    saveToDatabase(results);
  } catch (e) {
    console.error("Failed to save", e);
  }

  return results;
}`;

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
      fileTree: MOCK_FILE_TREE,
      activeFilePath: null,
      isFetchingTree: false,
    };
  });

  const fetchWorkspaceTree = useCallback(async () => {
    setState(prev => ({ ...prev, isFetchingTree: true }));
    try {
      const response = await fetch('/api/workspace/tree');
      
      if (!response.ok) {
        setState(prev => ({ ...prev, isFetchingTree: false }));
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setState(prev => ({ ...prev, isFetchingTree: false }));
        return;
      }

      const data = await response.json();
      setState(prev => ({ ...prev, fileTree: data, isFetchingTree: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isFetchingTree: false }));
    }
  }, []);

  const openFile = useCallback(async (path: string) => {
    try {
      const response = await fetch(`/api/workspace/read?path=${encodeURIComponent(path)}`);
      
      if (!response.ok) {
        // Fallback for prototyping when backend is not ready
        let mockContent = `/**\n * Mock content for ${path}\n * Status: Disconnected from backend\n */\n\nvoid exampleFunction() {\n  // Logic for ${path.split('/').pop()} goes here\n}`;
        
        if (path === 'src/core/complex-module.ts') {
          mockContent = COMPLEX_TEST_CODE;
        }

        setState(prev => ({
          ...prev,
          code: mockContent,
          activeFilePath: path,
          originalMetrics: calculateComplexity(mockContent),
          isDiffOpen: false,
          proposedCode: "",
        }));
        return;
      }

      const content = await response.text();
      
      if (content.startsWith("ERROR:")) {
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
