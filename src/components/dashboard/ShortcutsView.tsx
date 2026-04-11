"use client"

import React from "react"
import { Keyboard, Laptop, Command, Terminal } from "lucide-react"

export function ShortcutsView() {
  const shortcuts = [
    { key: "Ctrl + S", action: "Save Active File" },
    { key: "Ctrl + Shift + S", action: "Save File As..." },
    { key: "Ctrl + O", action: "Open Browser File" },
    { key: "Ctrl + K, Ctrl + O", action: "Open Workspace Folder" },
    { key: "Ctrl + B", action: "Toggle Sidebar" },
    { key: "F1", action: "Command Palette (Monaco)" },
    { key: "Ctrl + F", action: "Find in Editor" },
    { key: "Ctrl + H", action: "Replace in Editor" },
    { key: "Alt + Up/Down", action: "Move Line Up/Down" },
    { key: "Shift + Alt + F", action: "Format Document" },
  ];

  return (
    <div className="h-full w-full bg-[#1e1e1e] p-8 overflow-y-auto scroll-thin">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <Keyboard className="w-8 h-8 text-[#007acc]" />
            <h1 className="font-headline text-3xl font-bold text-[#ffffff]">Keyboard Shortcuts</h1>
          </div>
          <p className="text-[#858585]">Master Octamind AI with these power-user keybindings.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#3c3c3c] bg-[#2d2d2d] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#007acc]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#cccccc]">Global Actions</h3>
            </div>
            <div className="divide-y divide-[#3c3c3c]">
              {shortcuts.slice(0, 5).map((s, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between group hover:bg-[#2a2d2e] transition-colors">
                  <span className="text-sm text-[#cccccc]">{s.action}</span>
                  <div className="flex items-center gap-1">
                    {s.key.split('+').map((part, idx) => (
                      <React.Fragment key={idx}>
                        <kbd className="px-1.5 py-0.5 rounded bg-[#3c3c3c] border border-[#4c4c4c] text-[10px] font-mono text-[#ffffff] min-w-[24px] text-center shadow-sm">
                          {part.trim()}
                        </kbd>
                        {idx < s.key.split('+').length - 1 && <span className="text-[10px] text-[#858585]">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#3c3c3c] bg-[#2d2d2d] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#007acc]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#cccccc]">Editor Commands</h3>
            </div>
            <div className="divide-y divide-[#3c3c3c]">
              {shortcuts.slice(5).map((s, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between group hover:bg-[#2a2d2e] transition-colors">
                  <span className="text-sm text-[#cccccc]">{s.action}</span>
                  <div className="flex items-center gap-1">
                    {s.key.split('+').map((part, idx) => (
                      <React.Fragment key={idx}>
                        <kbd className="px-1.5 py-0.5 rounded bg-[#3c3c3c] border border-[#4c4c4c] text-[10px] font-mono text-[#ffffff] min-w-[24px] text-center shadow-sm">
                          {part.trim()}
                        </kbd>
                        {idx < s.key.split('+').length - 1 && <span className="text-[10px] text-[#858585]">+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[#007acc]/5 border border-[#007acc]/20 flex items-start gap-4">
          <Command className="w-6 h-6 text-[#007acc] shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#ffffff]">Pro Tip: Command Palette</h4>
            <p className="text-xs text-[#858585] leading-relaxed">
              Press <kbd className="px-1 py-0.5 rounded bg-[#3c3c3c] text-[10px]">F1</kbd> while the editor is focused to open the Monaco Command Palette. From there, you can access hundreds of built-in VS Code-style commands and settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
