"use client"

import React from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { CodeEditor } from "@/components/dashboard/CodeEditor"
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel"
import { RefactorPanel } from "@/components/dashboard/RefactorPanel"
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
      // 1. Physical Complexity Analysis (Mathematical)
      const newMetrics = calculateComplexity(code)
      setMetrics(newMetrics)

      // 2. AI Style Detective
      const style = await analyzeCodeStyle({ code })
      setStyleReport(style)

      // 3. Local LLM Refactoring Suggestions
      const refactor = await localCodeRefactoring({ 
        code, 
        language: 'typescript' 
      })
      setRefactorReport(refactor)

      toast({
        title: "Analysis Complete",
        description: `Risk level: ${newMetrics.risk.toUpperCase()}`,
      })
    } catch (err) {
      toast({
        title: "Analysis Error",
        description: "Failed to connect to local AI node.",
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
      description: "Code has been updated based on AI suggestions.",
    })
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30 selection:text-white">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex min-h-0">
          {/* Main Editor Pane */}
          <div className="flex-1 min-w-0">
            <CodeEditor 
              value={code} 
              onChange={setCode} 
              onAnalyze={handleAnalyze}
              isAnalyzing={isBusy}
            />
          </div>

          {/* Right Analysis Pane */}
          <div className="w-80 border-l bg-card/20 shrink-0">
            <AnalysisPanel 
              metrics={metrics} 
              style={styleReport}
              isAnalyzing={isBusy}
            />
          </div>
        </div>

        {/* Bottom Refactoring Suggestions Pane */}
        <div className="h-64 border-t shrink-0">
          <RefactorPanel 
            suggestions={refactorReport} 
            isRefactoring={isBusy}
            onApply={applyRefactor}
          />
        </div>
      </main>
      
      <Toaster />
    </div>
  )
}
