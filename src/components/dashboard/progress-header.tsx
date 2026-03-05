"use client";

import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressHeaderProps {
  connected: number;
  total: number;
  percentage: number;
  isCompact?: boolean;
}

export function ProgressHeader({
  connected,
  total,
  percentage,
  isCompact = false,
}: ProgressHeaderProps) {
  const isComplete = percentage === 100;

  return (
    <div
      className={cn(
        "transition-all duration-300",
        isCompact
          ? "rounded-xl border border-border bg-background/90 backdrop-blur-xl p-3 sm:p-4 shadow-md"
          : "relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-2xl"
      )}
    >
      {!isCompact && (
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      )}

      {isCompact ? (
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
              isComplete
                ? "bg-primary/20 text-primary"
                : "bg-primary/10 text-primary"
            )}
          >
            {isComplete ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}
          </div>
          <span className="text-lg font-bold tabular-nums text-foreground">
            {percentage}%
          </span>
          <div className="flex-1 h-2 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            {connected} of {total}
          </span>
        </div>
      ) : (
        <div className="relative space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={cn(
                  "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl shadow-inner transition-colors duration-500",
                  isComplete
                    ? "bg-primary/20 text-primary"
                    : "bg-primary/10 text-primary"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-semibold tracking-tight text-foreground">
                  Wealth Profile Completeness
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isComplete
                    ? "All sources connected. Ready for analysis."
                    : "Connect all data sources for maximum tax accuracy."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <span className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {percentage}%
              </span>
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                {connected} of {total} sources
              </span>
            </div>
          </div>

          <div className="relative h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
