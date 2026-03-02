"use client";

import { Progress } from "@/components/ui/progress";
import { Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressHeaderProps {
  connected: number;
  total: number;
  percentage: number;
}

export function ProgressHeader({
  connected,
  total,
  percentage,
}: ProgressHeaderProps) {
  const isComplete = percentage === 100;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 shadow-2xl">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl shadow-inner transition-colors duration-500",
              isComplete ? "bg-primary/20 text-primary" : "bg-amber-500/10 text-amber-500"
            )}>
              {isComplete ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Zap className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Data Connection Progress
              </h2>
              <p className="text-sm text-muted-foreground">
                {isComplete 
                  ? "All sources connected. Ready for analysis."
                  : "Connect sources to uncover tax savings."}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
              {percentage}%
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {connected} of {total} sources
            </span>
          </div>
        </div>

        <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/5">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
