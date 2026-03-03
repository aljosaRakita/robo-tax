"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Calculator,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CategoryInfo, SavingsResponse } from "@/lib/types";

interface SavingsDialogProps {
  percentage: number;
  connectedIds: string[];
  categories: CategoryInfo[];
  connectedByCategory: Record<string, number>;
}

export function SavingsDialog({ percentage, connectedIds, categories, connectedByCategory }: SavingsDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setHasResults(!!localStorage.getItem("robotax-results"));
  }, []);

  const missingCategories = categories.filter(
    (cat) => (connectedByCategory[cat.id] ?? 0) === 0
  );
  const hasAllCategories = missingCategories.length === 0;

  // Progressive glow intensity based on connection percentage
  const glowIntensity = Math.min(percentage / 100, 1);
  const buttonGlowStyle = !loading
    ? {
        "--glow-size": `${6 + glowIntensity * 14}px`,
        "--glow-opacity": `${glowIntensity * 0.6}`,
      } as React.CSSProperties
    : undefined;

  function handleButtonClick() {
    if (!hasAllCategories) {
      setShowWarning(true);
      return;
    }
    handleCalculate();
  }

  async function handleCalculate() {
    setShowWarning(false);
    setLoading(true);

    try {
      const res = await fetch("/api/savings/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectedIds }),
      });
      const data: SavingsResponse = await res.json();

      if (data.estimate) {
        localStorage.setItem("robotax-results", JSON.stringify(data.estimate));
        localStorage.removeItem("robotax-results-seen");
        setHasResults(true);
        router.push("/results");
      }
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-medium text-foreground">
            Connect More Sources
          </span>
          <span className="text-xs text-muted-foreground">
            Add more data sources to improve your savings estimate.
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
          {hasResults && (
            <Button
              variant="outline"
              size="lg"
              className="shrink-0 gap-2 h-12 sm:h-14 px-3 sm:px-6 rounded-xl"
              onClick={() => router.push("/results")}
            >
              <Eye className="h-5 w-5" />
              <span className="hidden sm:inline">View Results</span>
            </Button>
          )}
          <Button
            onClick={handleButtonClick}
            size="lg"
            disabled={loading}
            className={cn(
              "flex-1 sm:flex-initial gap-2 sm:gap-3 text-sm sm:text-base font-semibold transition-all duration-500 h-12 sm:h-14 px-4 sm:px-8 rounded-xl truncate",
              !loading
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md animate-pulse-glow"
                : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
            )}
            style={buttonGlowStyle}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
            ) : (
              <Calculator className="h-5 w-5 shrink-0" />
            )}
            <span className="sm:hidden">
              {loading ? "Analyzing..." : connectedIds.length > 0 ? `Calculate (${connectedIds.length})` : "Calculate"}
            </span>
            <span className="hidden sm:inline">
              {loading ? "Analyzing..." : connectedIds.length > 0 ? `Calculate Savings (${connectedIds.length} sources)` : "Calculate Savings"}
            </span>
          </Button>
        </div>
      </div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="max-w-md border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-foreground">
              Missing data sources
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Connect at least one source from each category for better results.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            {missingCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm text-foreground/80"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {cat.label}
              </div>
            ))}
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button
              className="w-full h-12 rounded-xl"
              onClick={() => setShowWarning(false)}
            >
              Add more sources
            </Button>
            <Button
              variant="ghost"
              className="w-full h-10 rounded-xl text-muted-foreground"
              onClick={handleCalculate}
            >
              Calculate anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
