"use client";

import { cn } from "@/lib/utils";
import type { CategoryInfo, PowerUpCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  Calculator,
  Users,
  FlaskConical,
  Home,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  landmark: Landmark,
  calculator: Calculator,
  users: Users,
  "flask-conical": FlaskConical,
  home: Home,
  "file-text": FileText,
};

interface CategoryStepperProps {
  categories: CategoryInfo[];
  currentStep: number;
  onStepChange: (step: number) => void;
  connectedByCategory: Record<string, number>;
  totalByCategory: Record<string, number>;
}

export function CategoryStepper({
  categories,
  currentStep,
  onStepChange,
  connectedByCategory,
  totalByCategory,
}: CategoryStepperProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === categories.length - 1;

  return (
    <div className="space-y-4">
      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {categories.map((cat, idx) => {
          const Icon = iconMap[cat.icon] ?? Landmark;
          const connected = connectedByCategory[cat.id] ?? 0;
          const total = totalByCategory[cat.id] ?? 0;
          const isCurrent = idx === currentStep;
          const isComplete = connected === total && total > 0;

          return (
            <button
              key={cat.id}
              onClick={() => onStepChange(idx)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm font-medium transition-all duration-200",
                isCurrent
                  ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                  : isComplete
                    ? "border-primary/30 bg-primary/5 text-primary"
                    : "border-border bg-foreground/[0.02] text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isCurrent
                    ? "bg-primary/20"
                    : isComplete
                      ? "bg-primary/10"
                      : "bg-foreground/5"
                )}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs sm:text-sm">
                  {cat.label}
                </span>
                <span
                  className={cn(
                    "text-[11px] tabular-nums",
                    isCurrent || isComplete
                      ? "text-primary/70"
                      : "text-muted-foreground/70"
                  )}
                >
                  {connected}/{total}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current step header */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-foreground/[0.02] p-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            {categories[currentStep]?.label}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {categories[currentStep]?.description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-sm font-medium text-muted-foreground">
            Step {currentStep + 1} of {categories.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={isFirst}
              onClick={() => onStepChange(currentStep - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={isLast}
              onClick={() => onStepChange(currentStep + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
