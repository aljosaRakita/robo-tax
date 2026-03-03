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
import type { SavingsResponse } from "@/lib/types";

interface SavingsDialogProps {
  percentage: number;
  connectedIds: string[];
}

export function SavingsDialog({ percentage, connectedIds }: SavingsDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    setHasResults(!!localStorage.getItem("robotax-results"));
  }, []);

  const isReady = percentage >= 30;

  // Progressive glow intensity based on connection percentage
  const glowIntensity = Math.min(percentage / 100, 1);
  const buttonGlowStyle = isReady && !loading
    ? {
        "--glow-size": `${6 + glowIntensity * 14}px`,
        "--glow-opacity": `${glowIntensity * 0.6}`,
      } as React.CSSProperties
    : undefined;

  async function handleCalculate() {
    setLoading(true);

    try {
      const res = await fetch("/api/savings/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectedIds }),
      });
      const data: SavingsResponse = await res.json();

      if (data.lowConfidence) {
        setOpen(true);
        setLoading(false);
        return;
      }

      if (data.estimate) {
        localStorage.setItem("robotax-results", JSON.stringify(data.estimate));
        localStorage.removeItem("robotax-results-seen");
        setHasResults(true);
        router.push("/results");
      }
    } catch {
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {isReady ? "Ready for Analysis" : "More Data Needed"}
          </span>
          <span className="text-xs text-muted-foreground">
            {isReady
              ? "We have enough data to estimate your tax savings."
              : "Connect at least 30% of sources to unlock savings estimate."}
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
          {hasResults && (
            <Button
              variant="outline"
              size="lg"
              className="shrink-0 gap-2 h-14 px-4 sm:px-6 rounded-xl"
              onClick={() => router.push("/results")}
            >
              <Eye className="h-5 w-5" />
              <span className="hidden sm:inline">View Results</span>
            </Button>
          )}
          <Button
            onClick={handleCalculate}
            size="lg"
            disabled={loading}
            className={cn(
              "flex-1 sm:flex-initial gap-2 sm:gap-3 text-sm sm:text-base font-semibold transition-all duration-500 h-14 px-4 sm:px-8 rounded-xl truncate",
              isReady && !loading
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-border bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold text-foreground">
              Not enough data yet
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              You&apos;ve only connected {connectedIds.length} data sources ({percentage}%).
              Connect more sources for a more accurate estimate.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="relative h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-foreground/5">
              <div
                className="absolute inset-y-0 left-0 bg-amber-500 transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground max-w-[280px]">
              We recommend connecting at least 30% of available sources for
              meaningful results.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Connect more sources
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
