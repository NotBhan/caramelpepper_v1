"use client"

import React from "react"
import { FolderOpen, MapPin, AlertCircle, Loader2, FileX } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WorkspacePickerModalProps {
  isOpen: boolean;
  onSelect: (path: string) => Promise<boolean>;
  onSkip: () => void;
}

export function WorkspacePickerModal({ isOpen, onSelect, onSkip }: WorkspacePickerModalProps) {
  const [path, setPath] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedPath = path.trim()
    if (!trimmedPath) return

    setError(null)
    setIsSubmitting(true)
    
    const success = await onSelect(trimmedPath)
    
    if (!success) {
      setError("Failed to open workspace. Ensure the absolute path is correct and accessible by the backend.")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[560px] bg-[#252526] border-[#3c3c3c] text-[#cccccc] p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="w-5 h-5 text-[#007acc]" />
              <DialogTitle className="font-headline text-xl text-[#ffffff]">Select Workspace</DialogTitle>
            </div>
            <DialogDescription className="text-[#858585] text-xs leading-relaxed">
              Browser-based file pickers are restricted in this environment. Please provide the absolute path to your project directory.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-3">
              <Label htmlFor="path" className="text-[10px] font-bold uppercase tracking-widest text-[#858585] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Absolute Project Path
              </Label>
              <Input
                id="path"
                placeholder="e.g., C:/Projects/App or /home/user/app"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="bg-[#1e1e1e] border-[#3c3c3c] focus:ring-[#007acc] h-10 text-[#ffffff] font-mono text-sm"
                autoFocus
              />
              <p className="text-[11px] text-[#858585]">
                Example for Firebase Studio: <code className="bg-[#1e1e1e] px-1.5 py-0.5 rounded text-[#cccccc] border border-[#3c3c3c]">/home/user/project</code>
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="bg-[#1e1e1e] px-6 py-4 flex items-center justify-between border-t border-[#3c3c3c] gap-4">
            <Button 
              type="button"
              variant="ghost"
              onClick={onSkip}
              className="text-[#858585] hover:text-[#ffffff] hover:bg-[#2a2d2e] text-xs h-9 px-3"
            >
              <FileX className="w-4 h-4 mr-2" />
              Skip Workspace
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                type="submit" 
                disabled={!path.trim() || isSubmitting}
                className="bg-[#007acc] hover:bg-[#0062a3] text-[#ffffff] font-bold h-9 px-6 min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Load Workspace"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
