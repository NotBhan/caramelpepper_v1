"use client"

import React from "react"
import { FolderOpen, MapPin, AlertCircle, Loader2 } from "lucide-react"
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
}

export function WorkspacePickerModal({ isOpen, onSelect }: WorkspacePickerModalProps) {
  const [path, setPath] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!path.trim()) return

    setError(null)
    setIsSubmitting(true)
    
    const success = await onSelect(path.trim())
    
    if (!success) {
      setError("Failed to open workspace. Ensure the absolute path is correct and accessible by the backend.")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[480px] bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-5 h-5 text-[#007acc]" />
            <DialogTitle className="font-headline text-xl text-[#ffffff]">Select Workspace</DialogTitle>
          </div>
          <DialogDescription className="text-[#858585]">
            Browser-based file pickers are restricted in this environment. Please provide the absolute path to your project directory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="path" className="text-xs font-bold uppercase tracking-wider text-[#858585] flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Absolute Project Path
            </Label>
            <Input
              id="path"
              placeholder="e.g., /home/user/my-project"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="bg-[#1e1e1e] border-[#3c3c3c] focus:ring-[#007acc] h-10 text-[#ffffff]"
              autoFocus
            />
            <p className="text-[11px] text-[#858585]">
              Example for Firebase Studio: <code className="bg-[#1e1e1e] px-1 rounded text-[#cccccc]">/home/user/project</code>
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

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!path.trim() || isSubmitting}
              className="w-full bg-[#007acc] hover:bg-[#0062a3] text-[#ffffff] font-bold"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}