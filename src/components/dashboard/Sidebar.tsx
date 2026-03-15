
"use client"

import React from "react"
import { ShieldCheck, LayoutGrid, FileCode, Search, Database, History, Settings, ChevronDown, Folder } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-1.5 w-full text-[13px] rounded-md transition-all duration-200 group",
      active 
        ? "bg-amber-600/10 text-amber-500 font-medium" 
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-amber-500" : "text-slate-500 group-hover:text-slate-300")} />
    <span>{label}</span>
  </button>
)

interface SidebarProps {
  onOpenSettings: () => void;
  activeProvider: string;
}

export function Sidebar({ onOpenSettings, activeProvider }: SidebarProps) {
  const [activeTab, setActiveTab] = React.useState('editor')

  return (
    <aside className="h-full flex flex-col bg-slate-950 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="text-amber-500 w-5 h-5" />
          <h1 className="font-headline text-lg font-bold tracking-tight text-slate-100">
            CaramelPepper
          </h1>
        </div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Local AI Engine</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 px-3">Main Navigation</div>
          <SidebarItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={FileCode} label="Code Editor" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
          <SidebarItem icon={Search} label="Style Detective" active={activeTab === 'detective'} onClick={() => setActiveTab('detective')} />
        </nav>

        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 px-3">Project Files</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 px-3 py-1 text-[13px] text-slate-400">
              <ChevronDown className="w-3 h-3" />
              <Folder className="w-3.5 h-3.5 text-amber-500/50" />
              <span>src</span>
            </div>
            <div className="ml-6 flex items-center gap-2 px-3 py-1 text-[13px] text-amber-500 bg-amber-500/5 rounded-sm border-l border-amber-500">
              <FileCode className="w-3.5 h-3.5" />
              <span>scratchpad.ts</span>
            </div>
            <div className="ml-6 flex items-center gap-2 px-3 py-1 text-[13px] text-slate-500 hover:text-slate-300 cursor-pointer">
              <FileCode className="w-3.5 h-3.5" />
              <span>utils.ts</span>
            </div>
          </div>
        </nav>

        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2 px-3">Artifacts</div>
          <SidebarItem icon={Database} label="Vault" active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
          <SidebarItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <SidebarItem icon={Settings} label="Settings" onClick={onOpenSettings} />
        <div className="mt-4 flex items-center gap-3 px-3 py-2 bg-slate-900 rounded-lg border border-slate-800">
          <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow-lg shadow-amber-900/20">
            CP
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-200">{activeProvider === 'local' ? 'Local Instance' : 'Cloud Proxy'}</span>
            <span className="text-[9px] text-slate-500 font-mono">
              {activeProvider === 'local' ? 'Llama-3-8B' : activeProvider.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
