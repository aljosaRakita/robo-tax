"use client";

import { useState } from "react";
import {
  Loader2,
  Calculator,
  AlertTriangle,
  DollarSign,
  Phone,
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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SavingsResponse | null>(null);

  const isReady = percentage >= 30;

  async function handleCalculate() {
    setOpen(true);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/savings/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectedIds }),
      });
      const data: SavingsResponse = await res.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        lowConfidence: false,
        warning: "Failed to calculate savings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number): string {
    if (amount >= 1000) {
      return `$${Math.round(amount / 1000)}k`;
    }
    return `$${amount.toLocaleString()}`;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="hidden text-sm text-muted-foreground sm:block">
          {isReady
            ? "Your data is ready for analysis"
            : `Connect at least 30% of sources to unlock savings estimate`}
        </div>
        <Button
          onClick={handleCalculate}
          size="lg"
          className={cn(
            "w-full gap-2 text-base font-semibold shadow-lg sm:w-auto",
            isReady && "animate-glow"
          )}
        >
          <Calculator className="h-5 w-5" />
          Calculate Tax Savings
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          {loading && (
            <div className="flex flex-col items-center gap-6 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="space-y-2 text-center">
                <DialogTitle className="text-lg">
                  Analyzing your data...
                </DialogTitle>
                <DialogDescription>
                  Matching against 435+ tax strategies
                </DialogDescription>
              </div>
              <Progress value={66} className="h-2 w-48" />
            </div>
          )}

          {!loading && result?.lowConfidence && (
            <>
              <DialogHeader>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100">
                  <AlertTriangle className="h-7 w-7 text-yellow-600" />
                </div>
                <DialogTitle className="text-center text-lg">
                  Not enough data yet
                </DialogTitle>
                <DialogDescription className="text-center">
                  {result.warning}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Current progress:</span>
                  <span className="font-semibold text-foreground">
                    {percentage}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2 w-48" />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  We recommend connecting at least 30% of available sources for
                  meaningful results.
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Connect more sources
                </Button>
              </DialogFooter>
            </>
          )}

          {!loading && result && !result.lowConfidence && result.estimate && (
            <>
              <DialogHeader>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <DollarSign className="h-7 w-7 text-green-600" />
                </div>
                <DialogTitle className="text-center text-2xl">
                  Up to{" "}
                  <span className="text-green-600">
                    {formatCurrency(result.estimate.aggressive)}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-center">
                  in potential tax savings
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">
                      Conservative
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(result.estimate.conservative)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <p className="text-xs text-muted-foreground">Base</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(result.estimate.base)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-muted-foreground">Aggressive</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(result.estimate.aggressive)}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-medium">
                      {result.estimate.confidence}%
                    </span>
                  </div>
                  <Progress
                    value={result.estimate.confidence}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Top strategies identified:
                  </p>
                  <ul className="space-y-1">
                    {result.estimate.topStrategies.slice(0, 5).map((s) => (
                      <li
                        key={s}
                        className="text-xs text-muted-foreground"
                      >
                        &bull; {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button className="w-full gap-2" size="lg">
                  <Phone className="h-4 w-4" />
                  Contact a Tax Professional
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
