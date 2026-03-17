"use client"

import React from "react"
import { ShieldCheck, LayoutGrid, FileCode, Search, Database, History, Settings, RefreshCw, AlertCircle, FolderOpen, FileQuestion } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileExplorer } from "./FileExplorer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
        ? "bg-[#007acc]/20 text-[#ffffff] font-medium" 
        : "text-[#cccccc] hover:bg-[#2a2d2e] hover:text-[#ffffff]"
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-[#007acc]" : "text-[#858585] group-hover:text-[#ffffff]")} />
    <span>{label}</span>
  </button>
)

interface SidebarProps {
  onOpenSettings: () => void;
  activeProvider: string;
  fileTree: any[];
  activeFilePath: string | null;
  isFetchingTree: boolean;
  onRefreshTree: () => void;
  onOpenFile: (path: string) => void;
  workspaceRoot: string | null;
  onOpenWorkspace: () => void;
}

export function Sidebar({ 
  onOpenSettings, 
  activeProvider,
  fileTree,
  activeFilePath,
  isFetchingTree,
  onRefreshTree,
  onOpenFile,
  workspaceRoot,
  onOpenWorkspace
}: SidebarProps) {
  const [activeTab, setActiveTab] = React.useState('editor')

  return (
    <aside className="h-full flex flex-col bg-[#252526] border-r border-[#3c3c3c]">
      <div className="p-4 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="text-[#007acc] w-5 h-5" />
          <h1 className="font-headline text-lg font-bold tracking-tight text-[#ffffff]">
            CaramelPepper
          </h1>
        </div>
        <p className="text-[10px] text-[#858585] uppercase font-bold tracking-widest">Local AI Engine</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-[#858585] uppercase tracking-wider mb-2 px-3">Main Navigation</div>
          <SidebarItem icon={LayoutGrid} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={FileCode} label="Code Editor" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
          <SidebarItem icon={Search} label="Style Detective" active={activeTab === 'detective'} onClick={() => setActiveTab('detective')} />
        </nav>

        <nav className="space-y-1">
          <div className="flex items-center justify-between mb-2 px-3">
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-bold text-[#858585] uppercase tracking-wider">Project Files</div>
              {!workspaceRoot && (
                <Badge variant="outline" className="h-4 px-1 text-[8px] border-amber-500/30 text-amber-500 gap-1 bg-amber-500/5">
                  <FileQuestion className="w-2 h-2" />
                  SINGLE
                </Badge>
              )}
            </div>
            {workspaceRoot && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 text-[#858585] hover:text-[#007acc]"
                onClick={onRefreshTree}
              >
                <RefreshCw className={cn("w-3 h-3", isFetchingTree && "animate-spin")} />
              </Button>
            )}
          </div>
          
          <div className="px-1">
            {workspaceRoot ? (
              <FileExplorer 
                items={fileTree} 
                activePath={activeFilePath} 
                onFileClick={onOpenFile} 
              />
            ) : (
              <div className="py-8 px-4 text-center space-y-4">
                <p className="text-[11px] text-[#858585] leading-relaxed">
                  No workspace opened. You are in Single File Mode.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onOpenWorkspace}
                  className="h-7 text-[10px] border-[#3c3c3c] text-[#cccccc] hover:bg-[#2a2d2e] w-full"
                >
                  <FolderOpen className="w-3 h-3 mr-2" />
                  Open Workspace
                </Button>
              </div>
            )}
          </div>
        </nav>

        <nav className="space-y-1">
          <div className="text-[10px] font-bold text-[#858585] uppercase tracking-wider mb-2 px-3">Artifacts</div>
          <SidebarItem icon={Database} label="Vault" active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
          <SidebarItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </nav>
      </div>

      <div className="p-4 border-t border-[#3c3c3c] bg-[#252526]">
        <SidebarItem icon={Settings} label="Settings" onClick={onOpenSettings} />
        <div className="mt-4 flex items-center gap-3 px-3 py-2 bg-[#1e1e1e] rounded-sm border border-[#3c3c3c]">
          <div className="w-7 h-7 rounded-sm bg-[#007acc] flex items-center justify-center text-[10px] font-bold text-[#ffffff]">
            CP
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-[#ffffff]">{activeProvider === 'local' ? 'Local Instance' : 'Cloud Proxy'}</span>
            <span className="text-[9px] text-[#858585] font-mono">
              {activeProvider === 'local' ? 'Llama-3-8B' : activeProvider.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
