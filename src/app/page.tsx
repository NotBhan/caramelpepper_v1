
"use client"

import React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { CodeEditor } from "@/components/dashboard/CodeEditor"
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel"
import { RefactorPanel } from "@/components/dashboard/RefactorPanel"
import { WorkspaceLayout } from "@/components/dashboard/WorkspaceLayout"
import { calculateComplexity, type ComplexityMetrics } from "@/lib/complexity"
import { analyzeCodeStyle, type CodeStyleOutput } from "@/ai/flows/code-style-alignment"
import { localCodeRefactoring, type LocalCodeRefactoringOutput } from "@/ai/flows/local-code-refactoring"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

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
  const [code, setCode] = React.useState(DEFAULT_CODE)
  const [metrics, setMetrics] = React.useState<ComplexityMetrics | null>(null)
  const [styleReport, setStyleReport] = React.useState<CodeStyleOutput | null>(null)
  const [refactorReport, setRefactorReport] = React.useState<LocalCodeRefactoringOutput | null>(null)
  const [isBusy, setIsBusy] = React.useState(false)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setIsBusy(true)
    try {
      const newMetrics = calculateComplexity(code)
      setMetrics(newMetrics)

      const style = await analyzeCodeStyle({ code })
      setStyleReport(style)

      const refactor = await localCodeRefactoring({ 
        code, 
        language: 'typescript' 
      })
      setRefactorReport(refactor)

      toast({
        title: "Analysis Complete",
        description: `Code integrity: ${newMetrics.risk.toUpperCase()}`,
      })
    } catch (err) {
      toast({
        title: "Analysis Error",
        description: "Failed to connect to local AI engine.",
        variant: "destructive",
      })
    } finally {
      setIsBusy(false)
    }
  }

  const applyRefactor = (newCode: string) => {
    setCode(newCode)
    setRefactorReport(null)
    setMetrics(calculateComplexity(newCode))
    toast({
      title: "Refactor Applied",
      description: "Codebase synchronized with AI suggestions.",
    })
  }

  return (
    <>
      <WorkspaceLayout
        sidebar={<Sidebar />}
        editor={
          <CodeEditor 
            value={code} 
            onChange={setCode} 
            onAnalyze={handleAnalyze}
            isAnalyzing={isBusy}
          />
        }
        refactor={
          <CodeEditor 
            title="refactor_preview.ts"
            value={refactorReport?.refactoredCode || "// Refactored code will appear here..."} 
            onChange={() => {}} 
            onAnalyze={() => {}}
            isAnalyzing={false}
            isReadOnly={true}
          />
        }
        analysis={
          <AnalysisPanel 
            metrics={metrics} 
            style={styleReport}
            isAnalyzing={isBusy}
          />
        }
        bottom={
          <RefactorPanel 
            suggestions={refactorReport} 
            isRefactoring={isBusy}
            onApply={applyRefactor}
          />
        }
      />
      <Toaster />
    </>
  )
}
