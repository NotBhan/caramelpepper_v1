"use client"

import React from "react"
import { Zap, ShieldAlert, Fingerprint } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type ComplexityMetrics } from "@/lib/complexity"
import { type CodeStyleOutput } from "@/ai/flows/code-style-alignment"
import { cn } from "@/lib/utils"

interface AnalysisPanelProps {
  metrics: ComplexityMetrics | null;
  style: CodeStyleOutput | null;
  isAnalyzing: boolean;
}

export function AnalysisPanel({ metrics, style, isAnalyzing }: AnalysisPanelProps) {
  if (!metrics && !isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#252526]">
        <div className="w-16 h-16 rounded-sm bg-[#1e1e1e] flex items-center justify-center mb-4 border border-[#3c3c3c]">
          <Zap className="w-8 h-8 text-[#858585]" />
        </div>
        <h3 className="font-headline text-lg font-semibold mb-2 text-[#ffffff]">Ready for Scan</h3>
        <p className="text-sm text-[#858585] max-w-[240px]">
          Load a file or paste code to start the local AI analysis engine.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto scroll-thin bg-[#252526]">
      <div className="p-6 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-[#858585]">Code Complexity</h3>
            {metrics && (
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase",
                metrics.risk === 'critical' ? "bg-red-500/20 text-red-500" :
                metrics.risk === 'high' ? "bg-red-500/20 text-red-400" :
                metrics.risk === 'moderate' ? "bg-amber-500/20 text-amber-500" :
                "bg-green-500/20 text-green-500"
              )}>
                {metrics.risk} Risk
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-[#1e1e1e] border-[#3c3c3c]">
              <CardContent className="p-4 flex flex-col items-center">
                <span className="text-2xl font-headline font-bold text-[#007acc]">{isAnalyzing ? "..." : metrics?.cyclomatic}</span>
                <span className="text-[10px] text-[#858585] uppercase">Cyclomatic</span>
              </CardContent>
            </Card>
            <Card className="bg-[#1e1e1e] border-[#3c3c3c]">
              <CardContent className="p-4 flex flex-col items-center">
                <span className="text-2xl font-headline font-bold text-[#007acc]">{isAnalyzing ? "..." : metrics?.maintainability}%</span>
                <span className="text-[10px] text-[#858585] uppercase">Maint. Index</span>
              </CardContent>
            </Card>
          </div>

          {metrics && (
            <div className="mt-4 space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>Maintainability Index</span>
                  <span>{metrics.maintainability}%</span>
                </div>
                <Progress value={metrics.maintainability} className="h-1 bg-[#3c3c3c]" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>Cognitive Load</span>
                  <span>{metrics.cognitive}/20</span>
                </div>
                <Progress value={(metrics.cognitive / 20) * 100} className="h-1 bg-[#3c3c3c]" />
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Fingerprint className="w-4 h-4 text-[#007acc]" />
            <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-[#858585]">Style Detective</h3>
          </div>
          
          <Card className="bg-[#1e1e1e] border-[#3c3c3c] overflow-hidden">
            <div className="divide-y divide-[#3c3c3c]">
              {[
                { label: 'Naming', value: style?.namingConvention || 'Analyzing...' },
                { label: 'Indentation', value: style?.indentation || 'Analyzing...' },
                { label: 'Braces', value: style?.braceStyle || 'Analyzing...' },
                { label: 'Quotes', value: style?.quoteStyle || 'Analyzing...' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 text-xs">
                  <span className="text-[#858585] font-medium">{item.label}</span>
                  <span className="font-code text-[#007acc]">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {metrics && metrics.risk === 'critical' && (
          <div className="p-4 rounded-sm bg-red-500/10 border border-red-500/20 flex gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-red-500">Technical Debt Warning</h4>
              <p className="text-[11px] leading-relaxed text-[#858585]">
                High complexity detected. Pepper-engine suggests splitting this logic into smaller modules to reduce cognitive load.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
