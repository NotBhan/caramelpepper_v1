
"use client"

import React from "react"
import { History, Clock, GitBranch, Github, Loader2 } from "lucide-react"
import { useAppStore } from "@/store/use-app-store"
import { Button } from "@/components/ui/button"

export function HistoryView() {
  const store = useAppStore();

  if (store.loadingAuth) {
    return (
      <div className="h-full w-full bg-[#1e1e1e] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-[#007acc] animate-spin" />
        <p className="text-sm text-[#858585]">Loading Sessions...</p>
      </div>
    );
  }

  if (!store.user) {
    return (
      <div className="h-full w-full bg-[#1e1e1e] p-8 flex items-center justify-center">
        <div className="max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-2xl bg-[#252526] border border-[#3c3c3c] flex items-center justify-center mx-auto shadow-2xl">
            <History className="w-10 h-10 text-[#858585]/30" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold text-[#ffffff]">History Locked</h2>
            <p className="text-sm text-[#858585] leading-relaxed">
              Sign in to keep a chronological log of all refactoring sessions and rollback any changes to previous states.
            </p>
          </div>
          <Button 
            onClick={store.login}
            className="bg-[#ffffff] text-[#000000] hover:bg-[#cccccc] font-bold px-8 py-6 rounded-lg gap-3 shadow-lg"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </Button>
        </div>
      </div>
    );
  }

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
            Refactoring history is stored in your secure user profile.
          </p>
        </div>
      </div>
    </div>
  )
}
