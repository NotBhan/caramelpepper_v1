"use client"

import React from "react"
import { LayoutGrid, Zap, ShieldCheck, History } from "lucide-react"

export function DashboardView() {
  return (
    <div className="h-full w-full bg-[#1e1e1e] p-8 overflow-y-auto scroll-thin">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-[#007acc]" />
            <h1 className="font-headline text-3xl font-bold text-[#ffffff]">Project Dashboard</h1>
          </div>
          <p className="text-[#858585]">High-level overview of your repository's health and refactoring progress.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#252526] border border-[#3c3c3c] p-6 rounded-lg space-y-4">
            <Zap className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-[#ffffff]">Recent Analysis</h3>
            <p className="text-xs text-[#858585]">No recent analysis detected. Open a file to start scanning.</p>
          </div>
          <div className="bg-[#252526] border border-[#3c3c3c] p-6 rounded-lg space-y-4">
            <ShieldCheck className="w-6 h-6 text-[#007acc]" />
            <h3 className="font-bold text-[#ffffff]">Overall Health</h3>
            <p className="text-xs text-[#858585]">Your project maintainability score will appear here.</p>
          </div>
          <div className="bg-[#252526] border border-[#3c3c3c] p-6 rounded-lg space-y-4">
            <History className="w-6 h-6 text-purple-500" />
            <h3 className="font-bold text-[#ffffff]">Total Optimizations</h3>
            <p className="text-xs text-[#858585]">0 successful refactors applied this session.</p>
          </div>
        </div>

        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#3c3c3c] bg-[#2d2d2d]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#cccccc]">System Status</h3>
          </div>
          <div className="p-8 text-center">
            <p className="text-sm text-[#858585]">Connect a workspace to see deep architectural insights.</p>
          </div>
        </div>
      </div>
    </div>
  )
}