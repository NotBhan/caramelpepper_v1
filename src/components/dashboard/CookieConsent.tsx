"use client"

import React from "react"
import { Cookie, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const consent = localStorage.getItem("octamind-cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("octamind-cookie-consent", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#252526] border border-[#3c3c3c] rounded-lg shadow-2xl p-4 flex items-center gap-4 backdrop-blur-md bg-opacity-95">
        <div className="w-10 h-10 rounded-full bg-[#007acc]/10 flex items-center justify-center shrink-0 border border-[#007acc]/20">
          <Cookie className="w-5 h-5 text-[#007acc]" />
        </div>
        
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-bold text-[#ffffff]">Workspace Persistence</h4>
          <p className="text-[11px] text-[#858585] leading-relaxed">
            We use essential cookies to persist your sidebar layout, workspace roots, and editor preferences across sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleAccept}
            className="h-8 bg-[#007acc] hover:bg-[#0062a3] text-[#ffffff] text-xs font-bold px-4"
          >
            Accept
          </Button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 text-[#858585] hover:text-[#ffffff] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
