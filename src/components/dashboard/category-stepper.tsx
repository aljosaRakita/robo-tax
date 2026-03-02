"use client";

import { cn } from "@/lib/utils";
import type { CategoryInfo, PowerUpCategory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  Calculator,
  Bitcoin,
  Home,
  Users,
  Puzzle,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  landmark: Landmark,
  calculator: Calculator,
  bitcoin: Bitcoin,
  home: Home,
  users: Users,
  puzzle: Puzzle,
  "flask-conical": FlaskConical,
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
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:gap-1 scrollbar-hide">
        {categories.map((cat, idx) => {
          const Icon = iconMap[cat.icon] ?? Puzzle;
          const connected = connectedByCategory[cat.id] ?? 0;
          const total = totalByCategory[cat.id] ?? 0;
          const isCurrent = idx === currentStep;
          const isComplete = connected === total && total > 0;
          const isPast = idx < currentStep;

          return (
            <div key={cat.id} className="flex items-center">
              <button
                onClick={() => onStepChange(idx)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : isComplete
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : isPast
                        ? "border-white/10 bg-white/5 text-foreground"
                        : "border-white/5 bg-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{cat.label}</span>
                <span
                  className={cn(
                    "text-xs tabular-nums rounded-full px-1.5 py-0.5",
                    isCurrent
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : isComplete
                        ? "bg-primary/20 text-primary"
                        : "bg-white/10 text-muted-foreground"
                  )}
                >
                  {connected}/{total}
                </span>
              </button>
              {idx < categories.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px w-6 shrink-0 transition-colors duration-300 sm:hidden",
                    idx < currentStep ? "bg-primary/50" : "bg-white/10"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step header */}
      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
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
              className="h-9 w-9 border-white/10 bg-transparent hover:bg-white/10"
              disabled={isFirst}
              onClick={() => onStepChange(currentStep - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-white/10 bg-transparent hover:bg-white/10"
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
