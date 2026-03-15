"use client"

import React from "react"
import { DiffEditor } from "@monaco-editor/react"
import { Check, X, TrendingDown, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type ComplexityMetrics } from "@/lib/complexity"
import { cn } from "@/lib/utils"

interface DiffViewerProps {
  original: string;
  modified: string;
  originalMetrics: ComplexityMetrics | null;
  proposedMetrics: ComplexityMetrics | null;
  onAccept: () => void;
  onReject: () => void;
}

export function DiffViewer({
  original,
  modified,
  originalMetrics,
  proposedMetrics,
  onAccept,
  onReject
}: DiffViewerProps) {
  const getImprovement = (key: keyof Pick<ComplexityMetrics, 'cyclomatic' | 'cognitive'>) => {
    if (!originalMetrics || !proposedMetrics) return null;
    const diff = originalMetrics[key] - proposedMetrics[key];
    const isBetter = diff > 0;
    return {
      diff: Math.abs(diff),
      isBetter,
      icon: isBetter ? TrendingDown : TrendingUp,
      color: isBetter ? "text-green-500" : "text-red-500"
    };
  };

  const cyc = getImprovement('cyclomatic');
  const cog = getImprovement('cognitive');

  return (
    <div className="flex flex-col h-full bg-[#0f172a] relative">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 font-mono text-[10px]">
            PROPOSED_REFACTOR.TS
          </Badge>
          
          {cyc && (
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-slate-800/50 border border-slate-700">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Complexity</span>
              <span className="text-[11px] font-mono text-slate-300">
                {originalMetrics?.cyclomatic} → {proposedMetrics?.cyclomatic}
              </span>
              <cyc.icon className={cn("w-3 h-3", cyc.color)} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReject}
            className="h-8 gap-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
          >
            <X className="w-3.5 h-3.5" />
            Discard
          </Button>
          <Button 
            size="sm" 
            onClick={onAccept}
            className="h-8 gap-2 bg-green-600 hover:bg-green-500 text-slate-900 font-bold shadow-lg shadow-green-900/20"
          >
            <Check className="w-3.5 h-3.5" />
            Accept Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <DiffEditor
          original={original}
          modified={modified}
          language="typescript"
          theme="vs-dark"
          options={{
            renderSideBySide: true,
            readOnly: true,
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: 'Source Code Pro, monospace',
            wordWrap: 'on',
            backgroundColor: '#0f172a'
          }}
        />
      </div>

      {proposedMetrics && proposedMetrics.risk === 'low' && originalMetrics && originalMetrics.risk !== 'low' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-md flex items-center gap-3 shadow-2xl">
          <AlertCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs font-bold text-green-400 uppercase tracking-tight">
            Significant Risk Reduction Detected
          </span>
        </div>
      )}
    </div>
  )
}
