
"use client"

import React from "react"
import { 
  File, 
  FolderOpen, 
  Save, 
  FilePlus, 
  Keyboard,
  ShieldCheck,
  Code
} from "lucide-react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useAppStore } from "@/store/use-app-store"
import { cn } from "@/lib/utils"

export function MenuBar() {
  const store = useAppStore(""); // Initialized with empty code, state managed by store internally

  const handleOpenFile = async () => {
    try {
      // @ts-ignore - modern File System Access API
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      // Since we can't easily get the absolute path in browser, 
      // we might just use the file name or rely on the backend connection.
      // For local tools, we usually use the path we know or get from tree.
      console.log("Opened file:", file.name);
    } catch (err) {
      console.log("File picker cancelled or failed");
    }
  }

  const handleOpenFolder = async () => {
    try {
      // @ts-ignore - modern File System Access API
      const dirHandle = await window.showDirectoryPicker();
      store.fetchWorkspaceTree(dirHandle.name);
    } catch (err) {
      console.log("Folder picker cancelled or failed");
    }
  }

  return (
    <div className="h-8 w-full bg-slate-900 border-b border-slate-800 flex items-center px-2 z-50">
      <div className="flex items-center gap-2 mr-4 px-2">
        <ShieldCheck className="w-4 h-4 text-amber-500" />
        <span className="text-[11px] font-bold text-slate-100 uppercase tracking-tight">CaramelPepper</span>
      </div>

      <Menubar className="bg-transparent border-none h-full shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="text-[11px] h-7 px-3 text-slate-400 data-[state=open]:bg-slate-800 data-[state=open]:text-slate-100 focus:bg-slate-800 focus:text-slate-100 cursor-default">
            File
          </MenubarTrigger>
          <MenubarContent className="bg-slate-900 border-slate-800 text-slate-200">
            <MenubarItem onClick={handleOpenFile} className="flex items-center gap-2 text-xs focus:bg-amber-600 focus:text-slate-900">
              <File className="w-3.5 h-3.5" />
              Open File...
              <MenubarShortcut>Ctrl+O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleOpenFolder} className="flex items-center gap-2 text-xs focus:bg-amber-600 focus:text-slate-900">
              <FolderOpen className="w-3.5 h-3.5" />
              Open Folder...
              <MenubarShortcut>Ctrl+K Ctrl+O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator className="bg-slate-800" />
            <MenubarItem 
              onClick={store.saveActiveFile} 
              disabled={!store.activeFilePath}
              className="flex items-center gap-2 text-xs focus:bg-amber-600 focus:text-slate-900"
            >
              <Save className="w-3.5 h-3.5" />
              Save
              <MenubarShortcut>Ctrl+S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem 
              onClick={() => {
                const newName = prompt("Enter new file path:", store.activeFilePath || "");
                if (newName) store.saveFileAs(newName);
              }} 
              className="flex items-center gap-2 text-xs focus:bg-amber-600 focus:text-slate-900"
            >
              <FilePlus className="w-3.5 h-3.5" />
              Save As...
              <MenubarShortcut>Ctrl+Shift+S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="text-[11px] h-7 px-3 text-slate-400 data-[state=open]:bg-slate-800 data-[state=open]:text-slate-100 focus:bg-slate-800 focus:text-slate-100 cursor-default">
            Selection
          </MenubarTrigger>
          <MenubarContent className="bg-slate-900 border-slate-800 text-slate-200">
            <MenubarItem className="text-xs">Select All</MenubarItem>
            <MenubarItem className="text-xs">Expand Selection</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="text-[11px] h-7 px-3 text-slate-400 data-[state=open]:bg-slate-800 data-[state=open]:text-slate-100 focus:bg-slate-800 focus:text-slate-100 cursor-default">
            Help
          </MenubarTrigger>
          <MenubarContent className="bg-slate-900 border-slate-800 text-slate-200">
            <MenubarItem className="flex items-center gap-2 text-xs">
              <Keyboard className="w-3.5 h-3.5" />
              Keyboard Shortcuts
            </MenubarItem>
            <MenubarItem className="flex items-center gap-2 text-xs">
              <Code className="w-3.5 h-3.5" />
              API Reference
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <div className="ml-auto flex items-center gap-4 pr-4">
        {store.isDirty && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-bold text-amber-500 uppercase">Unsaved Changes</span>
          </div>
        )}
        <div className="text-[10px] text-slate-500 font-mono">
          {store.activeFilePath || "No File Open"}
        </div>
      </div>
    </div>
  )
}
