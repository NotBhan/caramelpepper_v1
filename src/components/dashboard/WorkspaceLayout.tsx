
"use client"

import React from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { cn } from "@/lib/utils"
import { type AppView } from "@/store/use-app-store"
import { DashboardView } from "./DashboardView"
import { StyleDetectiveView } from "./StyleDetectiveView"
import { VaultView } from "./VaultView"
import { HistoryView } from "./HistoryView"

interface WorkspaceLayoutProps {
  sidebar: React.ReactNode;
  editor: React.ReactNode;
  refactor: React.ReactNode;
  analysis: React.ReactNode;
  bottom: React.ReactNode;
  isDiffOpen?: boolean;
  activeView: AppView;
}

export function WorkspaceLayout({
  sidebar,
  editor,
  refactor,
  analysis,
  bottom,
  isDiffOpen = false,
  activeView
}: WorkspaceLayoutProps) {
  const LAYOUT_KEY = "octamind-ai-layout-v1"
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const onLayout = (sizes: number[]) => {
    if (isMounted) {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(sizes))
    }
  }

  // Prevent hydration mismatch by rendering a skeleton or empty state initially
  if (!isMounted) {
    return <div className="h-full w-full bg-[#1e1e1e]" />
  }

  // Handle non-editor views with a stable, non-resizable container
  if (activeView !== 'editor') {
    return (
      <div className="h-full w-full flex bg-[#1e1e1e]">
        <div className="w-auto h-full shrink-0 border-r border-[#3c3c3c]">
          {sidebar}
        </div>
        <div className="flex-1 min-w-0">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'style_detective' && <StyleDetectiveView />}
          {activeView === 'vault' && <VaultView />}
          {activeView === 'history' && <HistoryView />}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-[#1e1e1e] text-[#cccccc] flex flex-col">
      <PanelGroup 
        id="main-horizontal-group"
        direction="horizontal" 
        onLayout={onLayout}
        autoSaveId="octamind-main-layout"
      >
        {/* Project Explorer / Sidebar */}
        <Panel
          id="sidebar-panel"
          defaultSize={15}
          minSize={10}
          maxSize={25}
          className="bg-[#252526]"
        >
          {sidebar}
        </Panel>

        <ResizeHandle direction="vertical" id="sidebar-resizer" />

        {/* Main Workspace Area */}
        <Panel id="workspace-panel" defaultSize={65}>
          <PanelGroup id="main-vertical-group" direction="vertical">
            <Panel id="top-editor-panel" defaultSize={80} minSize={20}>
              <PanelGroup id="editor-diff-group" direction="horizontal">
                {/* Primary Code Editor */}
                <Panel id="primary-editor" defaultSize={isDiffOpen ? 40 : 100} minSize={10}>
                  <div className="h-full transition-all duration-300 ease-in-out">
                    {editor}
                  </div>
                </Panel>
                
                {isDiffOpen && <ResizeHandle direction="vertical" id="diff-resizer" />}

                {/* AI Refactor Preview / Diff */}
                {isDiffOpen && (
                  <Panel id="diff-preview-panel" defaultSize={60} minSize={10}>
                    <div className="h-full animate-in slide-in-from-right duration-300">
                      {refactor}
                    </div>
                  </Panel>
                )}
              </PanelGroup>
            </Panel>

            <ResizeHandle direction="horizontal" id="bottom-panel-resizer" />

            {/* Terminal / Health / Logs */}
            <Panel id="bottom-console-panel" defaultSize={20} minSize={0} collapsible>
              {bottom}
            </Panel>
          </PanelGroup>
        </Panel>

        <ResizeHandle direction="vertical" id="analysis-panel-resizer" />

        {/* Right Analysis Panel */}
        <Panel
          id="right-analysis-panel"
          defaultSize={20}
          minSize={15}
          maxSize={30}
        >
          {analysis}
        </Panel>
      </PanelGroup>
    </div>
  )
}

function ResizeHandle({ 
  className, 
  direction = "vertical",
  id
}: { 
  className?: string;
  direction?: "horizontal" | "vertical";
  id: string;
}) {
  return (
    <PanelResizeHandle
      id={id}
      className={cn(
        "relative flex items-center justify-center bg-[#1e1e1e] transition-colors hover:bg-[#007acc]/50 group",
        direction === "vertical" ? "w-1 cursor-col-resize border-l border-[#3c3c3c]" : "h-1 cursor-row-resize border-t border-[#3c3c3c]",
        className
      )}
    >
      <div className={cn(
        "bg-[#3c3c3c] group-hover:bg-[#ffffff]/50 transition-colors",
        direction === "vertical" ? "h-8 w-[1px]" : "w-8 h-[1px]"
      )} />
    </PanelResizeHandle>
  )
}
