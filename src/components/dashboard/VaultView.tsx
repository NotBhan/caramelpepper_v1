
"use client"

import React from "react"
import { Database, Lock, ShieldCheck, Key, Github, Loader2 } from "lucide-react"
import { useAppStore } from "@/store/use-app-store"
import { Button } from "@/components/ui/button"

export function VaultView() {
  const store = useAppStore();

  if (store.loadingAuth) {
    return (
      <div className="h-full w-full bg-[#1e1e1e] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-[#007acc] animate-spin" />
        <p className="text-sm text-[#858585]">Verifying Identity...</p>
      </div>
    );
  }

  if (!store.user) {
    return (
      <div className="h-full w-full bg-[#1e1e1e] p-8 flex items-center justify-center">
        <div className="max-w-md text-center space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 rounded-2xl bg-[#252526] border border-[#3c3c3c] flex items-center justify-center mx-auto shadow-2xl">
            <Lock className="w-10 h-10 text-[#858585]/30" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold text-[#ffffff]">Authentication Required</h2>
            <p className="text-sm text-[#858585] leading-relaxed">
              Please sign in to securely manage your AI provider credentials and project-specific context in the encrypted vault.
            </p>
          </div>
          <Button 
            onClick={store.login}
            className="bg-[#ffffff] text-[#000000] hover:bg-[#cccccc] font-bold px-8 py-6 rounded-lg gap-3 shadow-lg"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </Button>
        </div>
      </div>
    );
  }

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
            <p className="text-xs text-[#858585]">Stored securely and scoped to your user identity.</p>
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
