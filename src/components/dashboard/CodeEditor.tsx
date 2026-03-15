
"use client"

import React from "react"
import Editor from "@monaco-editor/react"
import { Copy, Trash2, FileJson, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  title?: string;
  isReadOnly?: boolean;
}

export function CodeEditor({ 
  value, 
  onChange, 
  onAnalyze, 
  isAnalyzing, 
  title = "scratchpad.ts",
  isReadOnly = false
}: CodeEditorProps) {
  const lineCount = value.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-medium font-headline text-slate-300">{title}</span>
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white">
              <Copy className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button 
              onClick={onAnalyze} 
              disabled={isAnalyzing}
              size="sm" 
              className="h-8 gap-2 bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20"
            >
              <Layers className={cn("w-3 h-3", isAnalyzing && "animate-spin")} />
              {isAnalyzing ? "Processing..." : "Analyze"}
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val || "")}
          options={{
            readOnly: isReadOnly,
            fontSize: 13,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: 'Source Code Pro, monospace'
          }}
        />
      </div>

      <div className="px-4 py-1 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center text-[10px] text-slate-500">
        <div className="flex gap-4">
          <span>Lines: {lineCount}</span>
          <span>UTF-8</span>
          <span>TypeScript</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
          <span>LSP Active</span>
        </div>
      </div>
    </div>
  )
}
