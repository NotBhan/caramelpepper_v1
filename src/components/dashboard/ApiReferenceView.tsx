"use client"

import React from "react"
import { Code, Server, Shield, Zap, Globe, Cpu } from "lucide-react"

export function ApiReferenceView() {
  const apis = [
    {
      title: "Refactor API",
      endpoint: "POST /api/ai/refactor",
      desc: "Orchestrates code optimization between local and cloud engines.",
      params: ["code (string)", "language (string)", "provider (enum)", "style (object)"]
    },
    {
      title: "Style Detective",
      endpoint: "POST /api/ai/analyze-style",
      desc: "AST-aware analysis that identifies repository-wide formatting patterns.",
      params: ["code (string)"]
    },
    {
      title: "Workspace Tree",
      endpoint: "GET /api/workspace/tree",
      desc: "Recursively maps the local or browser-based directory structure.",
      params: ["path? (string)"]
    },
    {
      title: "Secret Vault",
      endpoint: "POST /api/settings/keys",
      desc: "Securely persists encrypted API credentials to the backend vault.",
      params: ["provider (string)", "key (string)"]
    }
  ];

  return (
    <div className="h-full w-full bg-[#1e1e1e] p-8 overflow-y-auto scroll-thin">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-[#007acc]" />
            <h1 className="font-headline text-3xl font-bold text-[#ffffff]">API Reference</h1>
          </div>
          <p className="text-[#858585]">Technical documentation for the Octamind AI internal architecture.</p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {apis.map((api, i) => (
            <div key={i} className="bg-[#252526] border border-[#3c3c3c] rounded-lg overflow-hidden group hover:border-[#007acc]/40 transition-all duration-300">
              <div className="p-4 border-b border-[#3c3c3c] bg-[#2d2d2d] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#ffffff] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {api.title}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#1e1e1e] text-[#007acc] px-2 py-0.5 rounded border border-[#3c3c3c]">
                  {api.endpoint}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-[#cccccc] leading-relaxed">{api.desc}</p>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[#858585] uppercase tracking-widest">Expected Payload</h4>
                  <div className="flex flex-wrap gap-2">
                    {api.params.map((p, idx) => (
                      <span key={idx} className="text-[11px] font-mono bg-[#1e1e1e] border border-[#3c3c3c] px-2 py-1 rounded text-[#858585]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-lg bg-green-500/5 border border-green-500/10 space-y-3">
            <Shield className="w-6 h-6 text-green-500" />
            <h4 className="text-sm font-bold text-[#ffffff]">Secure Backend Proxy</h4>
            <p className="text-xs text-[#858585] leading-relaxed">
              Octamind AI uses a Node.js proxy to forward client requests to our high-performance C++ backend. This ensures sensitive API keys never leave the server's context.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-[#007acc]/5 border border-[#007acc]/10 space-y-3">
            <Globe className="w-6 h-6 text-[#007acc]" />
            <h4 className="text-sm font-bold text-[#ffffff]">WASM AST Parsing</h4>
            <p className="text-xs text-[#858585] leading-relaxed">
              Our Style Detective utilizes WebAssembly-based tree-sitter grammars to perform real-time Abstract Syntax Tree (AST) analysis directly in the edge runtime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
