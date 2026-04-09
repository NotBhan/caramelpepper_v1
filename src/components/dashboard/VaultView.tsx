"use client"

import React from "react"
import { Database, Lock, ShieldCheck, Key } from "lucide-react"

export function VaultView() {
  return (
    <div className="h-full w-full bg-[#1e1e1e] p-8 overflow-y-auto scroll-thin">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-[#007acc]" />
            <h1 className="font-headline text-3xl font-bold text-[#ffffff]">Local Secret Vault</h1>
          </div>
          <p className="text-[#858585]">Manage your AI provider credentials and project-specific RAG context.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#252526] border border-[#3c3c3c] p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <Lock className="w-6 h-6 text-green-500" />
              <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded">ENCRYPTED</span>
            </div>
            <h3 className="font-bold text-[#ffffff]">API Credentials</h3>
            <p className="text-xs text-[#858585]">Stored in `secrets.json` with OS-level 0600 permissions.</p>
          </div>
          <div className="bg-[#252526] border border-[#3c3c3c] p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-6 h-6 text-[#007acc]" />
              <span className="text-[10px] font-bold bg-[#007acc]/10 text-[#007acc] px-2 py-0.5 rounded">ACTIVE</span>
            </div>
            <h3 className="font-bold text-[#ffffff]">Privacy Policy</h3>
            <p className="text-xs text-[#858585]">CaramelPepper never transmits your source code to external cloud logs.</p>
          </div>
        </div>

        <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <Key className="w-12 h-12 text-[#858585] opacity-20" />
            <h3 className="text-lg font-bold text-[#ffffff]">Provider Management</h3>
            <p className="text-sm text-[#858585]">
              Use the Settings menu (bottom left) to rotate or update your provider keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}