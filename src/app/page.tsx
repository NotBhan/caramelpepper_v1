
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
  const [isBusy, setIsBusy] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setIsBusy(true)
    try {
      const style = await analyzeCodeStyle({ code: store.code })
      setStyleReport(style)

      const refactor = await localCodeRefactoring({ 
        code: store.code, 
        language: 'typescript' 
      })
      
      if (refactor.refactoredCode) {
        store.openDiff(refactor.refactoredCode)
      }

      toast({
        title: "Analysis Complete",
        description: `Provider: ${store.inferenceProvider.toUpperCase()} | Risk: ${store.originalMetrics?.risk.toUpperCase()}`,
      })
    } catch (err) {
      toast({
        title: "Analysis Error",
        description: "Inference engine failed. Check your vault settings.",
        variant: "destructive",
      })
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <>
      <WorkspaceLayout
        isDiffOpen={store.isDiffOpen}
        sidebar={
          <Sidebar 
            onOpenSettings={() => setIsSettingsOpen(true)} 
            activeProvider={store.inferenceProvider}
          />
        }
        editor={
          <CodeEditor 
            value={store.code} 
            onChange={store.setCode} 
            onAnalyze={handleAnalyze}
            isAnalyzing={isBusy}
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
            suggestions={null} 
            isRefactoring={isBusy}
            onApply={() => {}}
          />
        }
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        provider={store.inferenceProvider}
        onProviderChange={store.setInferenceProvider}
        keyStatus={store.keyStatus}
        onSaveKey={store.saveApiKey}
      />
      
      <Toaster />
    </>
  )
}
