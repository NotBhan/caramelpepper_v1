"use client"

import React from "react"
import { Wand2, Check, X, RefreshCw, MessageSquareCode, Sparkles, MoveRight } from "lucide-react"
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
      <div className="p-8 h-full flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Wand2 className="w-10 h-10 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm font-headline font-bold">Generating Suggestions</p>
          <p className="text-xs text-muted-foreground italic">Running quantized Llama-3 locally...</p>
        </div>
      </div>
    )
  }

  if (!suggestions) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <Sparkles className="w-8 h-8 text-muted-foreground mb-4 opacity-50" />
        <p className="text-sm text-muted-foreground">Refactoring suggestions will appear here after analysis.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="p-4 border-b flex items-center justify-between bg-card/30">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="w-4 h-4 text-primary" />
          <h3 className="font-headline text-sm font-bold">Refactor Suggestions</h3>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          {suggestions.suggestions.length} Improvements Found
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="bg-secondary/20 rounded-lg p-4 border border-border">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Complexity Analysis</h4>
            <p className="text-xs leading-relaxed">{suggestions.complexityAnalysis}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Key Suggestions</h4>
            {suggestions.suggestions.map((suggestion, i) => (
              <div key={i} className="group p-3 rounded-lg bg-card border hover:border-primary/50 transition-colors flex gap-3">
                <div className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold">{i + 1}</span>
                </div>
                <p className="text-xs leading-relaxed pt-1 flex-1">{suggestion}</p>
              </div>
            ))}
          </div>

          {suggestions.refactoredCode && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Refactored Preview</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-[10px]">
                    <X className="w-3 h-3 mr-1" /> Ignore
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => onApply(suggestions.refactoredCode)}
                    className="h-7 text-[10px] bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Check className="w-3 h-3 mr-1" /> Apply Changes
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 overflow-hidden relative">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-accent/20" />
                <pre className="text-[11px] font-code text-accent/90 overflow-x-auto whitespace-pre-wrap">
                  {suggestions.refactoredCode.substring(0, 300)}
                  {suggestions.refactoredCode.length > 300 && "..."}
                </pre>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
