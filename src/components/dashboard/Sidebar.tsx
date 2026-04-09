"use client"

import React from "react"
import { 
  ShieldCheck, 
  LayoutGrid, 
  FileCode, 
  Search, 
  Database, 
  History, 
  Settings, 
  RefreshCw, 
  FolderOpen, 
  FileQuestion,
  Clock,
  Fingerprint,
  Code2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FileExplorer } from "./FileExplorer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type AppView } from "@/store/use-app-store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ActivityIconProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const ActivityIcon = ({ icon: Icon, label, active, onClick }: ActivityIconProps) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "w-full aspect-square flex items-center justify-center transition-all relative group",
            active 
              ? "text-[#ffffff]" 
              : "text-[#858585] hover:text-[#cccccc]"
          )}
        >
          {active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ffffff]" />}
          <Icon className="w-6 h-6" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-[#252526] border-[#3c3c3c] text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
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
  activeView: AppView;
  setActiveView: (view: AppView) => void;
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
  onOpenWorkspace,
  activeView,
  setActiveView
}: SidebarProps) {
  return (
    <div className="h-full flex overflow-hidden">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-2 shrink-0 border-r border-[#1e1e1e]">
        <ActivityIcon 
          icon={LayoutGrid} 
          label="Dashboard" 
          active={activeView === 'dashboard'} 
          onClick={() => setActiveView('dashboard')} 
        />
        <ActivityIcon 
          icon={FileCode} 
          label="Explorer" 
          active={activeView === 'editor'} 
          onClick={() => setActiveView('editor')} 
        />
        <ActivityIcon 
          icon={Search} 
          label="Style Detective" 
          active={activeView === 'style_detective'} 
          onClick={() => setActiveView('style_detective')} 
        />
        <ActivityIcon 
          icon={Database} 
          label="Vault" 
          active={activeView === 'vault'} 
          onClick={() => setActiveView('vault')} 
        />
        <ActivityIcon 
          icon={History} 
          label="Refactor History" 
          active={activeView === 'history'} 
          onClick={() => setActiveView('history')} 
        />
        
        <div className="mt-auto w-full">
          <ActivityIcon 
            icon={Settings} 
            label="Settings" 
            onClick={onOpenSettings} 
          />
        </div>
      </div>

      {/* Sidebar Panel */}
      <aside className={cn(
        "flex-1 flex flex-col bg-[#252526] transition-all duration-200 overflow-hidden",
        activeView === 'dashboard' || activeView === 'vault' || activeView === 'history' ? "w-0 opacity-0" : "w-auto opacity-100"
      )}>
        <div className="p-3 border-b border-[#3c3c3c] flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#858585] uppercase tracking-wider">
            {activeView === 'editor' ? 'Explorer' : 'Detective'}
          </span>
          {activeView === 'editor' && workspaceRoot && (
            <button 
              onClick={onRefreshTree}
              className="text-[#858585] hover:text-[#ffffff] transition-colors"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isFetchingTree && "animate-spin")} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeView === 'editor' && (
            <div className="py-2">
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
          )}

          {activeView === 'style_detective' && (
            <div className="p-4 text-center space-y-4">
              <Fingerprint className="w-8 h-8 text-[#007acc] mx-auto opacity-50" />
              <p className="text-[11px] text-[#858585]">Configure your repository-wide style preferences to guide the refactoring engine.</p>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-[#3c3c3c]">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-[#1e1e1e] rounded-sm border border-[#3c3c3c]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#007acc]" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-[#ffffff] leading-none uppercase">{activeProvider === 'local' ? 'Local' : activeProvider}</span>
              <span className="text-[8px] text-[#858585] font-mono">Engine Active</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}