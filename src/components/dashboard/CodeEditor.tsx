"use client"

import React from "react"
import { Play, Copy, Trash2, FileJson, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function CodeEditor({ value, onChange, onAnalyze, isAnalyzing }: CodeEditorProps) {
  const lineCount = value.split('\n').length;

  return (
    <Card className="flex flex-col h-full bg-black border-border overflow-hidden rounded-none border-0 border-r border-l">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card/50">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium font-headline">scratchpad.ts</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Copy className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10">
            <Trash2 className="w-3 h-3" />
          </Button>
          <Button 
            onClick={onAnalyze} 
            disabled={isAnalyzing}
            size="sm" 
            className="h-8 gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          >
            <Layers className={cn("w-3 h-3", isAnalyzing && "animate-spin")} />
            {isAnalyzing ? "Analyzing..." : "Analyze Complexity"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-12 bg-card/30 border-r text-right pr-3 py-4 text-[11px] font-code text-muted-foreground/50 select-none">
          {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent border-0 focus:ring-0 text-[13px] font-code leading-6 p-4 resize-none outline-none text-foreground scroll-thin"
          placeholder="// Paste your code here to analyze complexity..."
        />
      </div>

      <div className="px-4 py-1 border-t bg-card/50 flex justify-between items-center text-[10px] text-muted-foreground">
        <div className="flex gap-4">
          <span>Lines: {lineCount}</span>
          <span>UTF-8</span>
          <span>TypeScript</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Local Engine Ready</span>
        </div>
      </div>
    </Card>
  )
}

import { cn } from "@/lib/utils"
