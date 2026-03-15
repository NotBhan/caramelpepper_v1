
"use client"

import { useState, useCallback, useEffect } from "react"
import { type ComplexityMetrics, calculateComplexity } from "@/lib/complexity"

export type InferenceProvider = 'local' | 'anthropic' | 'openai';

export interface AppState {
  code: string;
  isDiffOpen: boolean;
  proposedCode: string;
  originalMetrics: ComplexityMetrics | null;
  proposedMetrics: ComplexityMetrics | null;
  inferenceProvider: InferenceProvider;
  apiKeys: Record<string, string>;
}

export function useAppStore(initialCode: string) {
  const [state, setState] = useState<AppState>(() => {
    // Initial state with defaults
    return {
      code: initialCode,
      isDiffOpen: false,
      proposedCode: "",
      originalMetrics: calculateComplexity(initialCode),
      proposedMetrics: null,
      inferenceProvider: 'local',
      apiKeys: {},
    };
  });

  // Load persistence on mount
  useEffect(() => {
    const savedProvider = localStorage.getItem('cp_inference_provider') as InferenceProvider;
    const savedKeys = localStorage.getItem('cp_api_keys');
    
    if (savedProvider || savedKeys) {
      setState(prev => ({
        ...prev,
        inferenceProvider: savedProvider || 'local',
        apiKeys: savedKeys ? JSON.parse(savedKeys) : {},
      }));
    }
  }, []);

  const setInferenceProvider = useCallback((provider: InferenceProvider) => {
    setState(prev => {
      localStorage.setItem('cp_inference_provider', provider);
      return { ...prev, inferenceProvider: provider };
    });
  }, []);

  const setApiKey = useCallback((provider: string, key: string) => {
    setState(prev => {
      const newKeys = { ...prev.apiKeys, [provider]: key };
      localStorage.setItem('cp_api_keys', JSON.stringify(newKeys));
      return { ...prev, apiKeys: newKeys };
    });
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
    setApiKey,
  };
}
