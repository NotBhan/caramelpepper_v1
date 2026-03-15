
"use client"

import React from "react"
import { Wand2, Check, X, MessageSquareCode, Sparkles, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { type LocalCodeRefactoringOutput } from "@/ai/flows/local-code-refactoring"

interface RefactorPanelProps {
  suggestions: LocalCodeRefactoringOutput | null;
  isRefactoring: boolean;
  onApply: (code: string) => void;
}

export function RefactorPanel({ suggestions, isRefactoring, onApply }: RefactorPanelProps) {
  if (isRefactoring) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-3 bg-slate-950">
        <div className="relative">
          <Wand2 className="w-8 h-8 text-orange-500 animate-pulse" />
          <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 animate-pulse" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Refactoring Engine Active</p>
      </div>
    )
  }

  if (!suggestions) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-2 text-slate-600 mb-2">
          <Terminal className="w-4 h-4" />
          <span className="text-[10px] font-mono">pepper-shell v1.0</span>
        </div>
        <p className="text-xs text-slate-500">Run an analysis to generate refactoring suggestions.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-950 border-t border-slate-800">
      <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="w-4 h-4 text-orange-500" />
          <h3 className="text-xs font-bold text-slate-200">Refactoring Strategy</h3>
        </div>
        <div className="flex gap-2">
          {suggestions.refactoredCode && (
            <Button 
              size="sm" 
              onClick={() => onApply(suggestions.refactoredCode)}
              className="h-7 px-3 text-[10px] bg-orange-600 text-white hover:bg-orange-500"
            >
              <Check className="w-3 h-3 mr-1" /> Commit Changes
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <ScrollArea className="flex-1 border-r border-slate-800">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Linguistic Analysis</h4>
              <p className="text-[13px] leading-relaxed text-slate-300 font-mono italic">
                {suggestions.complexityAnalysis}
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Optimization Tasks</h4>
            {suggestions.suggestions.map((suggestion, i) => (
              <div key={i} className="group p-2.5 rounded-md bg-slate-900 border border-slate-800 hover:border-orange-500/30 transition-colors flex gap-3">
                <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>
                </div>
                <p className="text-[12px] leading-snug text-slate-300 flex-1">{suggestion}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
