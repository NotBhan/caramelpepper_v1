"use client"

import React from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { cn } from "@/lib/utils"

interface WorkspaceLayoutProps {
  sidebar: React.ReactNode;
  editor: React.ReactNode;
  refactor: React.ReactNode;
  analysis: React.ReactNode;
  bottom: React.ReactNode;
  isDiffOpen?: boolean;
}

export function WorkspaceLayout({
  sidebar,
  editor,
  refactor,
  analysis,
  bottom,
  isDiffOpen = false
}: WorkspaceLayoutProps) {
  const LAYOUT_KEY = "caramel-pepper-layout"
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const onLayout = (sizes: number[]) => {
    if (isMounted) {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(sizes))
    }
  }

  if (!isMounted) {
    return <div className="h-screen w-screen bg-[#1e1e1e]" />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1e1e1e] text-[#cccccc] flex flex-col">
      <PanelGroup direction="horizontal" onLayout={onLayout}>
        {/* Project Explorer / Sidebar */}
        <Panel
          defaultSize={15}
          minSize={10}
          maxSize={25}
          className="bg-[#252526]"
        >
          {sidebar}
        </Panel>

        <ResizeHandle direction="vertical" />

        {/* Main Workspace Area */}
        <Panel defaultSize={65}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={80} minSize={20}>
              <PanelGroup direction="horizontal">
                {/* Primary Code Editor */}
                <Panel defaultSize={isDiffOpen ? 40 : 100} minSize={10}>
                  <div className="h-full transition-all duration-300 ease-in-out">
                    {editor}
                  </div>
                </Panel>
                
                {isDiffOpen && <ResizeHandle direction="vertical" />}

                {/* AI Refactor Preview / Diff */}
                {isDiffOpen && (
                  <Panel defaultSize={60} minSize={10}>
                    <div className="h-full animate-in slide-in-from-right duration-300">
                      {refactor}
                    </div>
                  </Panel>
                )}
              </PanelGroup>
            </Panel>

            <ResizeHandle direction="horizontal" />

            {/* Terminal / Health / Logs */}
            <Panel defaultSize={20} minSize={0} collapsible>
              {bottom}
            </Panel>
          </PanelGroup>
        </Panel>

        <ResizeHandle direction="vertical" />

        {/* Right Analysis Panel */}
        <Panel
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
  direction = "vertical" 
}: { 
  className?: string;
  direction?: "horizontal" | "vertical" 
}) {
  return (
    <PanelResizeHandle
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
