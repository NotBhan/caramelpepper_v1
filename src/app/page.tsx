"use client"

import React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { CodeEditor } from "@/components/dashboard/CodeEditor"
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel"
import { RefactorPanel } from "@/components/dashboard/RefactorPanel"
import { DiffViewer } from "@/components/dashboard/DiffViewer"
import { WorkspaceLayout } from "@/components/dashboard/WorkspaceLayout"
import { useAppStore } from "@/store/use-app-store"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { SettingsModal } from "@/components/dashboard/SettingsModal"
import { MenuBar } from "@/components/dashboard/MenuBar"
import { WorkspacePickerModal } from "@/components/dashboard/WorkspacePickerModal"

export default function Dashboard() {
  const store = useAppStore()
  const [styleReport, setStyleReport] = React.useState<any>(null)
  const [refactorOutput, setRefactorOutput] = React.useState<any>(null)
  const [isBusy, setIsBusy] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    if (!store.code) return;
    setIsBusy(true)
    setRefactorOutput(null)
    try {
      // 1. Backend isolated Style Analysis
      const styleResponse = await fetch('/api/ai/analyze-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: store.code })
      });
      
      if (!styleResponse.ok) {
        throw new Error('Style analysis engine failure');
      }
      
      const styleData = await styleResponse.json();
      setStyleReport(styleData);

      // 2. Backend isolated Refactoring
      const refactorResponse = await fetch('/api/ai/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: store.code,
          language: 'typescript',
          provider: store.inferenceProvider
        })
      });

      if (!refactorResponse.ok) {
        const errData = await refactorResponse.json();
        throw new Error(errData.error || 'AI Refactoring failed');
      }

      const refactorResult = await refactorResponse.json();
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
          activeView={store.activeView}
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
              activeView={store.activeView}
              setActiveView={store.setActiveView}
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
              activeFilePath={store.activeFilePath}
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
