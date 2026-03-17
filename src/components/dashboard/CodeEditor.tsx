"use client"

import React from "react"
import Editor from "@monaco-editor/react"
import { Copy, Trash2, FileJson, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const editorRef = React.useRef<any>(null);
  const monacoRef = React.useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  React.useEffect(() => {
    return () => {
      if (editorRef.current) {
        // Explicitly dispose of the editor to clear pending internal Monaco timeouts/hovers
        editorRef.current.dispose();
      }
      if (monacoRef.current) {
        // Dispose of models associated with this editor to prevent memory leaks
        const models = monacoRef.current.editor.getModels();
        models.forEach((model: any) => model.dispose());
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-[#3c3c3c]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#3c3c3c] bg-[#252526]">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-[#007acc]" />
          <span className="text-[12px] font-medium text-[#cccccc]">{title}</span>
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-2">
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
              className="h-8 gap-2 bg-[#007acc] hover:bg-[#0062a3] text-[#ffffff] font-bold"
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
