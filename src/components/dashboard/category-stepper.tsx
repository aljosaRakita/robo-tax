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
  HeartPulse,
  PiggyBank,
  Receipt,
  Laptop,
  Car,
  Building2,
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
  "heart-pulse": HeartPulse,
  "piggy-bank": PiggyBank,
  receipt: Receipt,
  laptop: Laptop,
  car: Car,
  "building-2": Building2,
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
      {/* Step indicators */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
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
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : isComplete
                      ? "border-green-500/50 bg-green-50 text-green-700"
                      : isPast
                        ? "border-border bg-accent text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-accent"
                )}
              >
                {isComplete ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">{cat.label}</span>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    isCurrent
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {connected}/{total}
                </span>
              </button>
              {idx < categories.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-px w-4 shrink-0",
                    idx < currentStep ? "bg-green-400" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {categories[currentStep]?.label}
          </h3>
          <p className="text-sm text-muted-foreground">
            {categories[currentStep]?.description}
          </p>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep + 1} of {categories.length}
        </span>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isFirst}
          onClick={() => onStepChange(currentStep - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isLast}
          onClick={() => onStepChange(currentStep + 1)}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
