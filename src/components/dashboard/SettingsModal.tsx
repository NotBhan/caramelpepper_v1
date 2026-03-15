
"use client"

import React from "react"
import { Settings, Cpu, Cloud, ShieldCheck, Key, CheckCircle2 } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { type InferenceProvider } from "@/store/use-app-store"
import { useToast } from "@/hooks/use-toast"

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  provider: InferenceProvider;
  onProviderChange: (p: InferenceProvider) => void;
  keyStatus: Record<string, boolean>;
  onSaveKey: (provider: string, key: string) => Promise<boolean>;
}

export function SettingsModal({
  isOpen,
  onOpenChange,
  provider,
  onProviderChange,
  keyStatus,
  onSaveKey
}: SettingsModalProps) {
  const [tempKey, setTempKey] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (!tempKey) return
    setIsSaving(true)
    const success = await onSaveKey(provider, tempKey)
    if (success) {
      setTempKey("") // Immediately clear from memory
      toast({
        title: "Vault Updated",
        description: `${provider.toUpperCase()} credentials secured in local vault.`,
      })
    }
    setIsSaving(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-amber-500" />
            <DialogTitle className="font-headline text-xl">Engine Configuration</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Configure local or cloud inference. Keys are stored in a secure backend vault.
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
                <SelectItem value="gemini">Google (Gemini)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {provider !== 'local' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5" />
                  {provider.charAt(0).toUpperCase() + provider.slice(1)} Key
                </Label>
                {keyStatus[provider] && (
                  <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Vault Ready
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder={keyStatus[provider] ? "••••••••••••••••" : "Enter API Key"}
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="bg-slate-950 border-slate-800 focus:ring-amber-500 h-9"
                />
                <Button 
                  onClick={handleSave} 
                  disabled={!tempKey || isSaving}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold px-4"
                >
                  {isSaving ? "..." : "Save"}
                </Button>
              </div>

              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                Backend vault management active (0600 perms).
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
            <Cloud className="w-4 h-4 text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-amber-500 uppercase">Secure Vault Architecture</h4>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Keys are never stored in the browser. The backend vault injects credentials directly into inference requests over encrypted channels.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
