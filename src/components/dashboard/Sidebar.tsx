"use client"

import React from "react"
import { Code2, ShieldCheck, Database, LayoutGrid, FileCode, Search, History, Settings } from "lucide-react"
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
      "flex items-center gap-3 px-3 py-2 w-full text-sm rounded-md transition-all duration-200 group",
      active 
        ? "bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent")} />
    <span>{label}</span>
  </button>
)

export function Sidebar() {
  const [activeTab, setActiveTab] = React.useState('editor')

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="font-headline text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            CaramelPepper
          </h1>
        </div>

        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-3">Workbench</div>
          <SidebarItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={FileCode} label="Code Editor" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
          <SidebarItem icon={Search} label="Style Detective" active={activeTab === 'detective'} onClick={() => setActiveTab('detective')} />
          
          <div className="mt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-3">Local Storage</div>
          <SidebarItem icon={Database} label="Style Vault" active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
          <SidebarItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </nav>
      </div>

      <div className="mt-auto p-4 border-t">
        <SidebarItem icon={Settings} label="Settings" onClick={() => {}} />
        <div className="mt-4 flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground">
            JS
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium">Local Node</span>
            <span className="text-[10px] text-muted-foreground">Quantized Llama-3-8B</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
