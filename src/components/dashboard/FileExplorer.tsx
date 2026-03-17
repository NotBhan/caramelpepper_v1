"use client"

import React from "react"
import { Folder, FileCode, ChevronRight, ChevronDown } from "lucide-react"
import { type FileItem } from "@/store/use-app-store"
import { cn } from "@/lib/utils"

interface FileExplorerProps {
  items: FileItem[];
  activePath: string | null;
  onFileClick: (path: string, handle?: any) => void;
}

export function FileExplorer({ items, activePath, onFileClick }: FileExplorerProps) {
  return (
    <div className="space-y-0.5">
      {items.map((item) => (
        <FileExplorerItem 
          key={item.path} 
          item={item} 
          activePath={activePath} 
          onFileClick={onFileClick} 
          depth={0}
        />
      ))}
    </div>
  )
}

interface FileExplorerItemProps {
  item: FileItem;
  activePath: string | null;
  onFileClick: (path: string, handle?: any) => void;
  depth: number;
}

function FileExplorerItem({ item, activePath, onFileClick, depth }: FileExplorerItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const isActive = activePath === item.path

  const handleToggle = () => {
    if (item.is_dir) {
      setIsExpanded(!isExpanded)
    } else {
      onFileClick(item.path, item.handle)
    }
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={handleToggle}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        className={cn(
          "flex items-center gap-2 py-0.5 w-full text-[13px] transition-colors group",
          isActive 
            ? "bg-[#37373d] text-[#ffffff] font-medium" 
            : "text-[#cccccc] hover:bg-[#2a2d2e] hover:text-[#ffffff]"
        )}
      >
        <span className="shrink-0">
          {item.is_dir ? (
            isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <div className="w-3.5" />
          )}
        </span>
        
        {item.is_dir ? (
          <Folder className={cn("w-4 h-4", isActive ? "text-[#007acc]" : "text-[#cccccc]/70")} />
        ) : (
          <FileCode className={cn("w-4 h-4", isActive ? "text-[#007acc]" : "text-[#858585]")} />
        )}
        
        <span className="truncate">{item.name}</span>
      </button>

      {item.is_dir && isExpanded && item.children && (
        <div className="flex flex-col">
          {item.children.map((child) => (
            <FileExplorerItem 
              key={child.path} 
              item={child} 
              activePath={activePath} 
              onFileClick={onFileClick} 
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
