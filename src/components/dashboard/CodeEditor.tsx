"use client"

import React from "react"
import Editor from "@monaco-editor/react"
import { Copy, Trash2, FileJson, Layers, X, Code2, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  title?: string;
  isReadOnly?: boolean;
  onClose?: () => void;
  activeFilePath: string | null;
}

export function CodeEditor({ 
  value, 
  onChange, 
  onAnalyze, 
  isAnalyzing, 
  title,
  isReadOnly = false,
  onClose,
  activeFilePath
}: CodeEditorProps) {
  const lineCount = value.split('\n').length;
  const editorRef = React.useRef<any>(null);
  const monacoRef = React.useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  React.useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
      if (monacoRef.current) {
        const models = monacoRef.current.editor.getModels();
        models.forEach((model: any) => model.dispose());
      }
    };
  }, []);

  if (!activeFilePath && !value) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#1e1e1e] text-center p-12">
        <div className="w-20 h-20 rounded-xl bg-[#252526] border border-[#3c3c3c] flex items-center justify-center mb-6 shadow-2xl">
          <Code2 className="w-10 h-10 text-[#858585]/30" />
        </div>
        <h2 className="text-xl font-headline font-bold text-[#ffffff] mb-2">Workbench Empty</h2>
        <p className="text-sm text-[#858585] max-w-sm leading-relaxed mb-8">
          Select a file from the explorer sidebar or open a single file via the Menu Bar to begin refactoring.
        </p>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[10px] text-[#858585] font-mono uppercase tracking-widest bg-[#252526] px-3 py-1.5 rounded border border-[#3c3c3c]">
            <Terminal className="w-3 h-3" />
            <span>Ready for Input</span>
          </div>
        </div>
      </div>
    );
  }

  const displayTitle = title || activeFilePath?.split(/[/\\]/).pop() || "scratchpad.ts";

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-[#3c3c3c]">
      <div className="flex items-center justify-between px-2 py-0 border-b border-[#3c3c3c] bg-[#252526] h-9">
        <div className="flex items-center h-full">
          <div className="flex items-center gap-2 px-3 h-full bg-[#1e1e1e] border-r border-[#3c3c3c] min-w-[120px]">
            <FileJson className="w-3.5 h-3.5 text-[#007acc]" />
            <span className="text-[11px] font-medium text-[#cccccc] truncate max-w-[180px]">{displayTitle}</span>
            <button 
              onClick={onClose}
              className="ml-2 p-0.5 rounded-sm hover:bg-[#3c3c3c] text-[#858585] hover:text-[#ffffff] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-1.5 pr-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#cccccc] hover:text-[#ffffff] hover:bg-[#2a2d2e]">
              <Copy className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
              <Trash2 className="w-3 h-3" />
            </Button>
            <Button 
              onClick={onAnalyze} 
              disabled={isAnalyzing}
              size="sm" 
              className="h-7 gap-1.5 px-3 bg-[#007acc] hover:bg-[#0062a3] text-[#ffffff] font-bold text-[10px]"
            >
              <Layers className={cn("w-3 h-3", isAnalyzing && "animate-spin")} />
              {isAnalyzing ? "Processing..." : "Optimize"}
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
          onMount={handleEditorDidMount}
          options={{
            readOnly: isReadOnly,
            fontSize: 13,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 },
            fontFamily: 'Source Code Pro, monospace',
            wordWrap: 'on',
            backgroundColor: '#1e1e1e'
          }}
        />
      </div>

      <div className="px-4 py-1 border-t border-[#3c3c3c] bg-[#252526] flex justify-between items-center text-[10px] text-[#858585]">
        <div className="flex gap-4">
          <span>Lines: {lineCount}</span>
          <span>UTF-8</span>
          <span>TypeScript</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#007acc]" />
          <span>LSP Active</span>
        </div>
      </div>
    </div>
  )
}
