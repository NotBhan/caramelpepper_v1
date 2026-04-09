"use client"

import React from "react"
import { History, Clock, GitBranch } from "lucide-react"

export function HistoryView() {
  return (
    <div className="h-full w-full bg-[#1e1e1e] p-8 overflow-y-auto scroll-thin">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-[#007acc]" />
            <h1 className="font-headline text-3xl font-bold text-[#ffffff]">Optimization History</h1>
          </div>
          <p className="text-[#858585]">Review and roll back previous AI refactoring sessions.</p>
        </header>

        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
          <div className="divide-y divide-[#3c3c3c]">
            <div className="p-8 text-center space-y-4">
              <Clock className="w-12 h-12 text-[#858585] mx-auto opacity-20" />
              <h3 className="font-bold text-[#ffffff]">No History Found</h3>
              <p className="text-sm text-[#858585]">Your applied refactors will appear here for audit and rollback purposes.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded bg-amber-500/5 border border-amber-500/20">
          <GitBranch className="w-5 h-5 text-amber-500" />
          <p className="text-xs text-[#cccccc]">
            <span className="font-bold text-amber-500 uppercase mr-2">Note:</span>
            Refactoring history is session-persistent. Long-term persistence via local SQLite is planned for v1.2.
          </p>
        </div>
      </div>
    </div>
  )
}