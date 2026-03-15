
"use client"

import React from "react"
import { Settings, Cpu, Cloud, ShieldCheck, Key } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type InferenceProvider } from "@/store/use-app-store"

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  provider: InferenceProvider;
  onProviderChange: (p: InferenceProvider) => void;
  apiKeys: Record<string, string>;
  onApiKeyChange: (provider: string, key: string) => void;
}

export function SettingsModal({
  isOpen,
  onOpenChange,
  provider,
  onProviderChange,
  apiKeys,
  onApiKeyChange
}: SettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <DialogTitle className="font-headline text-xl">Engine Configuration</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Configure your local or cloud inference providers for code analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Inference Provider
            </Label>
            <Select value={provider} onValueChange={(v) => onProviderChange(v as InferenceProvider)}>
              <SelectTrigger className="bg-slate-950 border-slate-800">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                <SelectItem value="local">Local (llama.cpp)</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="gemini">Google (Gemini)</SelectItem> // [UPDATE]: Added Gemini to provider selection list
              </SelectContent>
            </Select>
          </div>

          {provider !== 'local' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Key className="w-3.5 h-3.5" />
                {provider.charAt(0).toUpperCase() + provider.slice(1)} API Key
              </Label>
              <Input
                type="password"
                placeholder="Enter API Key"
                value={apiKeys[provider] || ""}
                onChange={(e) => onApiKeyChange(provider, e.target.value)} // [UPDATE]: Bound API key input to selected provider state
                className="bg-slate-950 border-slate-800 focus:ring-amber-500"
              />
              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                Stored locally in browser session storage.
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
            <Cloud className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-amber-500 uppercase">Hybrid Mode Note</h4>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Local mode uses your CPU/GPU (Llama-3-8B). Cloud providers offer higher precision but require an internet connection and external API billing.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
