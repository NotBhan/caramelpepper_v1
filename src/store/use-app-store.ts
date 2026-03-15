
"use client"

import { useState, useCallback, useEffect } from "react"
import { type ComplexityMetrics, calculateComplexity } from "@/lib/complexity"

export type InferenceProvider = 'local' | 'anthropic' | 'openai' | 'gemini';

export interface AppState {
  code: string;
  isDiffOpen: boolean;
  proposedCode: string;
  originalMetrics: ComplexityMetrics | null;
  proposedMetrics: ComplexityMetrics | null;
  inferenceProvider: InferenceProvider;
  keyStatus: Record<string, boolean>; // Replaces plaintext apiKeys
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
    };
  });

  useEffect(() => {
    const savedProvider = localStorage.getItem('cp_inference_provider') as InferenceProvider;
    
    // Simulate initial status fetch from backend
    const fetchStatus = async () => {
      // [SIMULATED]: In production, calls GET /settings/keys/status
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
    };

    fetchStatus();
  }, []);

  const setInferenceProvider = useCallback((provider: InferenceProvider) => {
    setState(prev => {
      localStorage.setItem('cp_inference_provider', provider);
      return { ...prev, inferenceProvider: provider };
    });
  }, []);

  const saveApiKey = useCallback(async (provider: string, key: string) => {
    // [SIMULATED]: In production, calls POST /settings/keys
    console.log(`[VAULT]: Sending key for ${provider} to backend vault...`);
    
    setState(prev => ({
      ...prev,
      keyStatus: { ...prev.keyStatus, [provider]: true }
    }));
    
    return true; // Return success to UI
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
  };
}
