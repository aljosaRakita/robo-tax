"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Calculator,
  AlertTriangle,
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
import { Progress } from "@/components/ui/progress";
import type { SavingsResponse } from "@/lib/types";

interface SavingsDialogProps {
  percentage: number;
  connectedIds: string[];
}

export function SavingsDialog({ percentage, connectedIds }: SavingsDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isReady = percentage >= 30;

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
      <div className="flex items-center justify-between gap-6">
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
        <Button
          onClick={handleCalculate}
          size="lg"
          disabled={loading}
          className={cn(
            "w-full gap-3 text-base font-semibold transition-all duration-500 sm:w-auto h-14 px-8 rounded-xl",
            isReady && !loading 
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-glow" 
              : "bg-white/5 text-muted-foreground hover:bg-white/10"
          )}
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Calculator className="h-5 w-5" />
          )}
          {loading ? "Analyzing Data..." : "Calculate Tax Savings"}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-white/10 bg-card/95 backdrop-blur-xl">
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
            <div className="relative h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-white/5">
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
              className="w-full border-white/10 bg-transparent hover:bg-white/5 text-foreground h-12 rounded-xl"
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
