
"use client"

import React from "react"
import { Settings, Cpu, Cloud, ShieldCheck, Key, CheckCircle2, Globe, Server } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  provider: InferenceProvider;
  onProviderChange: (p: InferenceProvider) => void;
  keyStatus: Record<string, boolean>;
  onSaveKey: (provider: string, key: string) => Promise<boolean>;
  ollamaConfig?: { url: string; model: string };
  onSaveOllama?: (url: string, model: string) => Promise<boolean>;
}

export function SettingsModal({
  isOpen,
  onOpenChange,
  provider,
  onProviderChange,
  keyStatus,
  onSaveKey,
  ollamaConfig,
  onSaveOllama
}: SettingsModalProps) {
  const [tempKey, setTempKey] = React.useState("")
  const [tempOllamaUrl, setTempOllamaUrl] = React.useState(ollamaConfig?.url || "")
  const [tempOllamaModel, setTempOllamaModel] = React.useState(ollamaConfig?.model || "")
  const [isSaving, setIsSaving] = React.useState(false)
  const [isTesting, setIsTesting] = React.useState(false)
  const { toast } = useToast()

  const handleSaveKey = async () => {
    if (!tempKey) return
    setIsSaving(true)
    const success = await onSaveKey(provider, tempKey)
    if (success) {
      setTempKey("")
      toast({
        title: "Vault Updated",
        description: `${provider.toUpperCase()} credentials secured in local vault.`,
      })
    }
    setIsSaving(false)
  }

  const handleSaveOllama = async () => {
    if (!tempOllamaUrl || !tempOllamaModel || !onSaveOllama) return
    setIsSaving(true)
    const success = await onSaveOllama(tempOllamaUrl, tempOllamaModel)
    if (success) {
      toast({
        title: "Ollama Config Saved",
        description: "Local inference settings updated.",
      })
    }
    setIsSaving(false)
  }

  const testOllama = async () => {
    setIsTesting(true)
    try {
      const response = await fetch(`${tempOllamaUrl}/api/tags`, { method: 'GET' })
      if (response.ok) {
        toast({
          title: "Connection Success",
          description: "Successfully pinged Ollama server.",
        })
      } else {
        throw new Error("Failed to connect")
      }
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: "Could not reach Ollama. Ensure it is running and CORS is enabled.",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-[#007acc]" />
            <DialogTitle className="font-headline text-xl">Engine Configuration</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Configure local or cloud inference. Credentials are stored in a secure backend vault.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Active Provider
            </Label>
            <Select value={provider} onValueChange={(v) => onProviderChange(v as InferenceProvider)}>
              <SelectTrigger className="bg-slate-950 border-slate-800">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-800 text-slate-100">
                <SelectItem value="local">Local (llama.cpp)</SelectItem>
                <SelectItem value="ollama">Ollama (Local API)</SelectItem>
                <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="gemini">Google (Gemini)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="cloud" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-950 border border-slate-800">
              <TabsTrigger value="cloud" className="text-xs data-[state=active]:bg-[#007acc]">Cloud Providers</TabsTrigger>
              <TabsTrigger value="ollama" className="text-xs data-[state=active]:bg-[#007acc]">Local Ollama</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cloud" className="space-y-4 pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Key className="w-3.5 h-3.5" />
                    Cloud API Keys
                  </Label>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder={keyStatus[provider] ? "••••••••••••••••" : "Enter API Key"}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    className="bg-slate-950 border-slate-800 focus:ring-[#007acc] h-9"
                  />
                  <Button 
                    onClick={handleSaveKey} 
                    disabled={!tempKey || isSaving}
                    size="sm"
                    className="bg-[#007acc] hover:bg-[#0062a3] text-[#ffffff] font-bold px-4"
                  >
                    Save
                  </Button>
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  Backend vault management active (0600 perms).
                </p>
              </div>
            </TabsContent>

            <TabsContent value="ollama" className="space-y-4 pt-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    Ollama Base URL
                  </Label>
                  <Input
                    placeholder="http://127.0.0.1:11434"
                    value={tempOllamaUrl}
                    onChange={(e) => setTempOllamaUrl(e.target.value)}
                    className="bg-slate-950 border-slate-800 h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Server className="w-3 h-3" />
                    Model Name
                  </Label>
                  <Input
                    placeholder="qwen2.5-coder"
                    value={tempOllamaModel}
                    onChange={(e) => setTempOllamaModel(e.target.value)}
                    className="bg-slate-950 border-slate-800 h-9"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline"
                    onClick={testOllama}
                    disabled={isTesting || !tempOllamaUrl}
                    className="flex-1 border-slate-800 text-xs h-8"
                  >
                    {isTesting ? "Pinging..." : "Test Connection"}
                  </Button>
                  <Button 
                    onClick={handleSaveOllama}
                    disabled={isSaving || !tempOllamaUrl || !tempOllamaModel}
                    className="flex-1 bg-[#007acc] hover:bg-[#0062a3] text-[#ffffff] font-bold text-xs h-8"
                  >
                    Update Config
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
