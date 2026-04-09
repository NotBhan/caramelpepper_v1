
"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { type ComplexityMetrics, calculateComplexity } from "@/lib/complexity"
import { readDirectoryRecursive } from "@/lib/browser-fs"
import { auth, githubProvider } from "@/lib/firebase"
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User } from "firebase/auth"

export type InferenceProvider = 'local' | 'anthropic' | 'openai' | 'gemini' | 'ollama' | 'llamacpp';
export type AppView = 'dashboard' | 'editor' | 'style_detective' | 'vault' | 'history';

export type FileItem = {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileItem[];
  handle?: any; 
};

export interface AppState {
  user: User | null;
  loadingAuth: boolean;
  code: string;
  isDiffOpen: boolean;
  proposedCode: string;
  originalMetrics: ComplexityMetrics | null;
  proposedMetrics: ComplexityMetrics | null;
  inferenceProvider: InferenceProvider;
  keyStatus: Record<string, boolean>;
  ollamaConfig: { url: string; model: string; useDefaultUrl: boolean };
  llamacppConfig: { url: string };
  fileTree: FileItem[];
  activeFilePath: string | null;
  isFetchingTree: boolean;
  isDirty: boolean;
  workspaceRoot: string | null;
  isPickerDismissed: boolean;
  activeView: AppView;
  isMobileMenuOpen: boolean;
}

const AppContext = createContext<ReturnType<typeof useAppStoreLogic> | null>(null);

function useAppStoreLogic(initialCode: string = "") {
  const [state, setState] = useState<AppState>({
    user: null,
    loadingAuth: true,
    code: initialCode,
    isDiffOpen: false,
    proposedCode: "",
    originalMetrics: initialCode ? calculateComplexity(initialCode) : null,
    proposedMetrics: null,
    inferenceProvider: 'ollama',
    keyStatus: {},
    ollamaConfig: { url: "http://127.0.0.1:11434", model: "qwen2.5-coder", useDefaultUrl: true },
    llamacppConfig: { url: "http://127.0.0.1:8080" },
    fileTree: [],
    activeFilePath: null,
    isFetchingTree: false,
    isDirty: false,
    workspaceRoot: null,
    isPickerDismissed: false,
    activeView: 'editor',
    isMobileMenuOpen: false,
  });

  useEffect(() => {
    if (!auth) {
      setState(prev => ({ ...prev, loadingAuth: false }));
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState(prev => ({ ...prev, user, loadingAuth: false }));
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async () => {
    if (!auth) {
      console.error("Firebase Auth not initialized. Check your .env file.");
      return;
    }
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      setState(prev => ({ ...prev, user: null }));
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  const fetchWorkspaceTree = useCallback(async (path?: string) => {
    setState(prev => ({ ...prev, isFetchingTree: true }));
    try {
      const url = path ? `/api/workspace/tree?path=${encodeURIComponent(path)}` : '/api/workspace/tree';
      const response = await fetch(url);
      
      if (!response.ok) {
        setState(prev => ({ ...prev, isFetchingTree: false }));
        throw new Error("Failed to load workspace tree");
      }

      const data = await response.json();
      setState(prev => ({ ...prev, fileTree: data, isFetchingTree: false }));
    } catch (err) {
      setState(prev => ({ ...prev, isFetchingTree: false }));
      throw err;
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
        await fetchWorkspaceTree(path);
        setState(prev => ({ ...prev, workspaceRoot: path, isPickerDismissed: true }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, [fetchWorkspaceTree]);

  const openBrowserWorkspace = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !window.showDirectoryPicker) {
        return false;
      }
      const handle = await (window as any).showDirectoryPicker();
      const tree = await readDirectoryRecursive(handle);
      
      setState(prev => ({
        ...prev,
        fileTree: tree,
        workspaceRoot: `browser://${handle.name}`,
        isPickerDismissed: true,
        activeView: 'editor'
      }));
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  const resetWorkspaceRoot = useCallback(() => {
    setState(prev => ({ ...prev, workspaceRoot: null, fileTree: [], isPickerDismissed: false, activeView: 'editor' }));
  }, []);

  const dismissPicker = useCallback(() => {
    setState(prev => ({ ...prev, isPickerDismissed: true }));
  }, []);

  const openFile = useCallback(async (path: string, handle?: any) => {
    try {
      let content = "";
      if (handle && handle.getFile) {
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
        activeView: 'editor'
      }));
    } catch (err) {
      console.error("[WORKSPACE]: Error reading file", err);
    }
  }, []);

  const newFile = useCallback(() => {
    setState(prev => ({
      ...prev,
      code: "",
      activeFilePath: "untitled.ts",
      originalMetrics: calculateComplexity(""),
      isDiffOpen: false,
      proposedCode: "",
      isDirty: false,
      activeView: 'editor'
    }));
  }, []);

  const closeActiveFile = useCallback(() => {
    setState(prev => ({
      ...prev,
      code: "",
      activeFilePath: null,
      originalMetrics: null,
      isDiffOpen: false,
      proposedCode: "",
      isDirty: false,
    }));
  }, []);

  const saveActiveFile = useCallback(async () => {
    if (!state.activeFilePath || state.activeFilePath === 'untitled.ts') {
      const newName = prompt("Enter file path to save as:");
      if (newName) await saveFileAs(newName);
      return;
    }
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
        if (state.workspaceRoot) {
          fetchWorkspaceTree(state.workspaceRoot);
        }
      }
    } catch (err) {
      console.error("[WORKSPACE]: Save As failed", err);
    }
  }, [state.code, state.workspaceRoot, fetchWorkspaceTree]);

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
          ollamaConfig: { ...prev.ollamaConfig, url, model }
        }));
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }, []);

  const saveLlamacppConfig = useCallback(async (url: string) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ llamacppUrl: url })
      });

      if (response.ok) {
        setState(prev => ({
          ...prev,
          llamacppConfig: { ...prev.llamacppConfig, url }
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

  const setActiveView = useCallback((view: AppView) => {
    setState(prev => ({ ...prev, activeView: view }));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setState(prev => ({ ...prev, isMobileMenuOpen: !prev.isMobileMenuOpen }));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setState(prev => ({ ...prev, isMobileMenuOpen: false }));
  }, []);

  return {
    ...state,
    login,
    logout,
    setCode,
    openDiff,
    acceptRefactor,
    rejectRefactor,
    setInferenceProvider,
    saveApiKey,
    saveOllamaConfig,
    saveLlamacppConfig,
    fetchWorkspaceTree,
    setWorkspaceRoot,
    openBrowserWorkspace,
    resetWorkspaceRoot,
    dismissPicker,
    openFile,
    newFile,
    closeActiveFile,
    saveActiveFile,
    saveFileAs,
    setActiveView,
    toggleMobileMenu,
    closeMobileMenu,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStoreLogic("");
  return React.createElement(AppContext.Provider, { value: store }, children);
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
