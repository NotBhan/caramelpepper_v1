"use client"

import React from "react"
import { Search, Fingerprint, Code2 } from "lucide-react"

export function StyleDetectiveView() {
  return (
    <div className="h-full w-full bg-[#1e1e1e] p-8 overflow-y-auto scroll-thin">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <Search className="w-8 h-8 text-[#007acc]" />
            <h1 className="font-headline text-3xl font-bold text-[#ffffff]">Style Detective</h1>
          </div>
          <p className="text-[#858585]">Configure repository-wide AST rules and formatting expectations.</p>
        </header>

        <div className="bg-[#252526] border border-[#3c3c3c] p-12 text-center rounded-lg space-y-4">
          <Fingerprint className="w-16 h-16 text-[#007acc] mx-auto opacity-20" />
          <h2 className="text-xl font-bold text-[#ffffff]">Pattern Analysis Active</h2>
          <p className="text-sm text-[#858585] max-w-md mx-auto">
            The detective automatically scans your files to learn your coding style. 
            In the future, you will be able to manually define "Style Vaults" to enforce specific enterprise standards.
          </p>
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border border-[#3c3c3c] rounded text-[10px] text-[#858585] font-mono uppercase">
              <Code2 className="w-3 h-3" />
              Learning Mode: Enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}