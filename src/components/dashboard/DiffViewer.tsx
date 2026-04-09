"use client"

import React from "react"
import { DiffEditor } from "@monaco-editor/react"
import { Check, X, TrendingDown, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type ComplexityMetrics } from "@/lib/complexity"
import { cn } from "@/lib/utils"
import { getLanguageFromPath } from "@/lib/language-mapper"

interface DiffViewerProps {
  original: string;
  modified: string;
  originalMetrics: ComplexityMetrics | null;
  proposedMetrics: ComplexityMetrics | null;
  onAccept: () => void;
  onReject: () => void;
  activeFilePath: string | null;
}

export function DiffViewer({
  original,
  modified,
  originalMetrics,
  proposedMetrics,
  onAccept,
  onReject,
  activeFilePath
}: DiffViewerProps) {
  const editorRef = React.useRef<any>(null);
  const monacoRef = React.useRef<any>(null);

  const [modelPaths] = React.useState(() => ({
    original: `file:///original-${Math.random().toString(36).slice(2, 9)}.ts`,
    modified: `file:///modified-${Math.random().toString(36).slice(2, 9)}.ts`
  }));

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  React.useEffect(() => {
    return () => {
      if (editorRef.current) {
        // Synchronously kill all internal Monaco timeouts, hover services, and workers
        editorRef.current.dispose();
      }
      if (monacoRef.current) {
        // Prevent memory leaks by disposing of associated text models
        const models = monacoRef.current.editor.getModels();
        models.forEach((model: any) => {
          if (model.uri.toString().includes('file:///original-') || 
              model.uri.toString().includes('file:///modified-')) {
            model.dispose();
          }
        });
      }
    };
  }, []);

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
  const language = getLanguageFromPath(activeFilePath);

  const editorOptions = React.useMemo(() => ({
    renderSideBySide: true,
    readOnly: true,
    fontSize: 13,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 16 },
    fontFamily: 'Source Code Pro, monospace',
    wordWrap: 'on' as const,
    backgroundColor: '#1e1e1e',
    folding: true,
    lineNumbers: 'on' as const,
    originalEditable: false,
    diffCodeLens: false,
  }), []);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] relative">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#3c3c3c] bg-[#252526]">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-[#007acc]/30 text-[#007acc] bg-[#007acc]/5 font-mono text-[10px]">
            {activeFilePath?.split(/[/\\]/).pop()?.toUpperCase() || "PROPOSED_REFACTOR.TS"}
          </Badge>
          
          {cyc && (
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-[#2a2d2e] border border-[#3c3c3c]">
              <span className="text-[10px] text-[#858585] uppercase font-bold">Complexity</span>
              <span className="text-[11px] font-mono text-[#cccccc]">
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
            className="h-8 gap-2 text-[#cccccc] hover:text-red-400 hover:bg-red-400/10"
          >
            <X className="w-3.5 h-3.5" />
            Discard
          </Button>
          <Button 
            size="sm" 
            onClick={onAccept}
            className="h-8 gap-2 bg-green-700 hover:bg-green-600 text-[#ffffff] font-bold"
          >
            <Check className="w-3.5 h-3.5" />
            Accept Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <DiffEditor
          height="100%"
          original={original}
          modified={modified}
          language={language}
          theme="vs-dark"
          options={editorOptions}
          onMount={handleEditorDidMount}
          originalModelPath={modelPaths.original}
          modifiedModelPath={modelPaths.modified}
        />
      </div>

      {proposedMetrics && proposedMetrics.risk === 'low' && originalMetrics && originalMetrics.risk !== 'low' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-sm bg-green-500/10 border border-green-500/20 backdrop-blur-md flex items-center gap-3 shadow-2xl">
          <AlertCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs font-bold text-green-400 uppercase tracking-tight">
            Significant Risk Reduction Detected
          </span>
        </div>
      )}
    </div>
  )
}
