"use client";

import { ChevronRight, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryPromptProps {
  connectedInCategory: number;
  totalInCategory: number;
  nextCategoryLabel?: string;
  onContinue: () => void;
  /** Whether the user has dismissed the prompt for this category */
  dismissed: boolean;
  onDismiss: () => void;
}

export function CategoryPrompt({
  connectedInCategory,
  totalInCategory,
  nextCategoryLabel,
  onContinue,
  dismissed,
  onDismiss,
}: CategoryPromptProps) {
  // Don't show if nothing connected yet or no next category
  if (connectedInCategory === 0 || !nextCategoryLabel) return null;

  // Don't show if user dismissed for this category
  if (dismissed) return null;

  const allConnected = connectedInCategory === totalInCategory;
  const remaining = totalInCategory - connectedInCategory;

  return (
    <div className="animate-slide-up rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {allConnected
                ? "All sources connected!"
                : `${connectedInCategory} source${connectedInCategory > 1 ? "s" : ""} connected`}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {allConnected
                ? `Great job! Ready to move on to ${nextCategoryLabel}.`
                : `${remaining} more available. Continue or add more sources.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:shrink-0">
          {!allConnected && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={onDismiss}
            >
              <Plus className="h-3.5 w-3.5" />
              Add more
            </Button>
          )}
          <Button
            size="sm"
            className={cn(
              "gap-1.5 rounded-lg shadow-sm",
              allConnected && "animate-pulse-glow",
            )}
            style={
              allConnected
                ? ({ "--glow-size": "6px", "--glow-opacity": "0.4" } as React.CSSProperties)
                : undefined
            }
            onClick={onContinue}
          >
            Continue to {nextCategoryLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
