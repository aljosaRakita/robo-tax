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
    <div className="space-y-3 sm:space-y-4">
      {/* Category tabs - horizontal scroll on mobile, grid on desktop */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-x-visible scrollbar-none">
          {categories.map((cat, idx) => {
            const Icon = iconMap[cat.icon] ?? Landmark;
            const connected = connectedByCategory[cat.id] ?? 0;
            const total = totalByCategory[cat.id] ?? 0;
            const isCurrent = idx === currentStep;
            const isComplete = connected === total && total > 0;
            const hasProgress = connected > 0 && !isComplete;

            return (
              <button
                key={cat.id}
                onClick={() => onStepChange(idx)}
                className={cn(
                  "flex shrink-0 items-center gap-2 sm:gap-2.5 rounded-xl border px-3 py-2.5 sm:p-3 text-left text-sm font-medium transition-all duration-200",
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(59,108,245,0.15)]"
                    : isComplete
                      ? "border-primary/30 bg-primary/5 text-primary"
                      : hasProgress
                        ? "border-primary/15 bg-primary/[0.03] text-foreground/80 hover:bg-primary/[0.06]"
                        : "border-border bg-foreground/[0.02] text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg",
                    isCurrent
                      ? "bg-primary/20"
                      : isComplete
                        ? "bg-primary/10"
                        : hasProgress
                          ? "bg-primary/10"
                          : "bg-foreground/5"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </div>
                <span className="whitespace-nowrap text-xs sm:text-sm sm:whitespace-normal sm:leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current step header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-foreground/[0.02] p-3 sm:p-4">
        <div className="min-w-0">
          <h3 className="text-base sm:text-xl font-semibold text-foreground">
            {categories[currentStep]?.label}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            {categories[currentStep]?.description}
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
            disabled={isFirst}
            onClick={() => onStepChange(currentStep - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
            disabled={isLast}
            onClick={() => onStepChange(currentStep + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
