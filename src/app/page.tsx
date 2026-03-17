"use client"

import React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { CodeEditor } from "@/components/dashboard/CodeEditor"
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel"
import { RefactorPanel } from "@/components/dashboard/RefactorPanel"
import { DiffViewer } from "@/components/dashboard/DiffViewer"
import { WorkspaceLayout } from "@/components/dashboard/WorkspaceLayout"
import { useAppStore } from "@/store/use-app-store"
import { analyzeCodeStyle } from "@/ai/flows/code-style-alignment"
import { localCodeRefactoring } from "@/ai/flows/local-code-refactoring"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { SettingsModal } from "@/components/dashboard/SettingsModal"
import { MenuBar } from "@/components/dashboard/MenuBar"
import { WorkspacePickerModal } from "@/components/dashboard/WorkspacePickerModal"

const DEFAULT_CODE = `function processData(data: any[]) {
  let results = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].status === 'active') {
      if (data[i].value > 100) {
        let transformed = data[i].value * 1.5;
        results.push({...data[i], transformed});
      } else if (data[i].value < 0) {
        // Skip negative
      } else {
        results.push(data[i]);
      }
    }
  }
  return results;
}`;

export default function Dashboard() {
  const store = useAppStore(DEFAULT_CODE)
  const [styleReport, setStyleReport] = React.useState<any>(null)
  const [refactorOutput, setRefactorOutput] = React.useState<any>(null)
  const [isBusy, setIsBusy] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setIsBusy(true)
    setRefactorOutput(null)
    try {
      const style = await analyzeCodeStyle({ code: store.code })
      setStyleReport(style)

      let refactorResult;

      if (store.inferenceProvider === 'ollama') {
        const response = await fetch('/api/ai/refactor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: store.code,
            language: 'typescript',
            provider: 'ollama'
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Ollama refactor failed');
        }

        refactorResult = await response.json();
      } else {
        refactorResult = await localCodeRefactoring({ 
          code: store.code, 
          language: 'typescript' 
        });
      }
      
      setRefactorOutput(refactorResult);

      if (refactorResult.refactoredCode) {
        store.openDiff(refactorResult.refactoredCode)
      }

      toast({
        title: "Analysis Complete",
        description: `Provider: ${store.inferenceProvider.toUpperCase()} | Risk: ${store.originalMetrics?.risk.toUpperCase()}`,
      })
    } catch (err: any) {
      toast({
        title: "Inference Error",
        description: err.message || "Engine failed. Check your configuration.",
        variant: "destructive",
      })
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MenuBar />
      <div className="flex-1">
        <WorkspaceLayout
          isDiffOpen={store.isDiffOpen}
          sidebar={
            <Sidebar 
              onOpenSettings={() => setIsSettingsOpen(true)} 
              activeProvider={store.inferenceProvider}
              fileTree={store.fileTree}
              activeFilePath={store.activeFilePath}
              isFetchingTree={store.isFetchingTree}
              onRefreshTree={() => store.fetchWorkspaceTree(store.workspaceRoot || undefined)}
              onOpenFile={store.openFile}
              workspaceRoot={store.workspaceRoot}
              onOpenWorkspace={() => store.resetWorkspaceRoot()}
            />
          }
          editor={
            <CodeEditor 
              value={store.code} 
              onChange={store.setCode} 
              onAnalyze={handleAnalyze}
              isAnalyzing={isBusy}
              onClose={store.closeActiveFile}
              activeFilePath={store.activeFilePath}
            />
          }
          refactor={
            <DiffViewer 
              original={store.code}
              modified={store.proposedCode}
              originalMetrics={store.originalMetrics}
              proposedMetrics={store.proposedMetrics}
              onAccept={store.acceptRefactor}
              onReject={store.rejectRefactor}
            />
          }
          analysis={
            <AnalysisPanel 
              metrics={store.originalMetrics} 
              style={styleReport}
              isAnalyzing={isBusy}
            />
          }
          bottom={
            <RefactorPanel 
              suggestions={refactorOutput} 
              isRefactoring={isBusy}
              onApply={store.acceptRefactor}
            />
          }
        />
      </div>
      
      <WorkspacePickerModal 
        isOpen={!store.isPickerDismissed && store.workspaceRoot === null}
        onSelect={store.setWorkspaceRoot}
        onSkip={store.dismissPicker}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        provider={store.inferenceProvider}
        onProviderChange={store.setInferenceProvider}
        keyStatus={store.keyStatus}
        onSaveKey={store.saveApiKey}
        ollamaConfig={store.ollamaConfig}
        onSaveOllama={store.saveOllamaConfig}
      />
      
      <Toaster />
    </div>
  )
}
