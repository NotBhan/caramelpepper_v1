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
}

export function WorkspaceLayout({
  sidebar,
  editor,
  refactor,
  analysis,
  bottom
}: WorkspaceLayoutProps) {
  const LAYOUT_KEY = "caramel-pepper-layout"
  const [isMounted, setIsMounted] = React.useState(false) // [UPDATE]: Initialized mount state to manage hydration lifecycle
  const [initialLayout, setInitialLayout] = React.useState<number[] | null>(null)

  React.useEffect(() => {
    const saved = localStorage.getItem(LAYOUT_KEY)
    if (saved) {
      try {
        setInitialLayout(JSON.parse(saved))
      } catch (e) {
        // Silently fail if layout is corrupted
      }
    }
    setIsMounted(true) // [UPDATE]: Set mounted status to allow safe client-side layout rendering
  }, [])

  const onLayout = (sizes: number[]) => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(sizes))
  }

  if (!isMounted) { // [UPDATE]: Guard clause implemented to prevent hydration mismatches with server-side renders
    return <div className="h-screen w-screen bg-slate-950" />
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-50 flex flex-col">
      <PanelGroup direction="horizontal" onLayout={onLayout}>
        {/* Project Explorer / Sidebar */}
        <Panel
          defaultSize={initialLayout ? initialLayout[0] : 15}
          minSize={10}
          maxSize={25}
          className="bg-slate-900/50"
        >
          {sidebar}
        </Panel>

        <ResizeHandle direction="vertical" />

        {/* Main Workspace Area */}
        <Panel defaultSize={initialLayout ? initialLayout[1] : 65}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={80} minSize={20}>
              <PanelGroup direction="horizontal">
                {/* Primary Code Editor */}
                <Panel defaultSize={50} minSize={10}>
                  {editor}
                </Panel>
                
                <ResizeHandle direction="vertical" />

                {/* AI Refactor Preview / Diff */}
                <Panel defaultSize={50} minSize={10}>
                  {refactor}
                </Panel>
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
          defaultSize={initialLayout ? initialLayout[2] : 20}
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
        "relative flex items-center justify-center bg-slate-800 transition-colors hover:bg-amber-500/50 group", // [UPDATE]: Reverted hover state to 'Warm Caramel' accent
        direction === "vertical" ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize",
        className
      )}
    >
      <div className={cn(
        "bg-slate-700 group-hover:bg-white/50 transition-colors",
        direction === "vertical" ? "h-8 w-[1px]" : "w-8 h-[1px]"
      )} />
    </PanelResizeHandle>
  )
}
