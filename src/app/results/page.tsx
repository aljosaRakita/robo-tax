"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Confetti } from "@neoconfetti/react";
import {
  DollarSign,
  PartyPopper,
  TrendingUp,
  Phone,
  ArrowLeft,
  BadgeDollarSign,
  Banknote,
  PiggyBank,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { SavingsEstimate } from "@/lib/types";

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${Math.round(amount / 1000)}k`;
  }
  return `$${amount.toLocaleString()}`;
}

export default function ResultsPage() {
  const router = useRouter();
  const [estimate, setEstimate] = useState<SavingsEstimate | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("robotax-results");
    if (!stored) {
      router.replace("/dashboard");
      return;
    }
    try {
      const data = JSON.parse(stored) as SavingsEstimate;
      setEstimate(data);

      // Only show confetti on first visit after a new calculation
      const seen = localStorage.getItem("robotax-results-seen");
      if (!seen) {
        setShowConfetti(true);
        localStorage.setItem("robotax-results-seen", "1");
      }
    } catch {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!estimate) {
    return null;
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-background px-4 py-12 overflow-hidden selection:bg-primary/30">
      <div className="pointer-events-none absolute -top-[20%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 opacity-50 blur-[120px]" />

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 flex items-start justify-center z-50">
          <Confetti
            particleCount={250}
            force={1}
            stageHeight={typeof window !== "undefined" ? window.innerHeight : 1000}
            duration={5000}
            colors={["#2563eb", "#3b82f6", "#60a5fa", "#0ea5e9", "#38bdf8", "#7c3aed", "#a78bfa"]}
            particleShape="mix"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        {/* Hero: amount + CTA — fits in one mobile viewport */}
        <div className="flex min-h-[calc(100dvh-6rem)] flex-col items-center justify-center gap-6 text-center sm:min-h-0 sm:pb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(59,108,245,0.1)]">
              <PartyPopper className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-400/10 border border-blue-400/20 shadow-[0_0_20px_rgba(96,165,250,0.15)] z-10 -mx-2">
              <BadgeDollarSign className="h-7 w-7 sm:h-8 sm:w-8 text-blue-300" />
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
              <Banknote className="h-5 w-5 sm:h-6 sm:w-6 text-sky-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
              <span className="block text-base sm:text-lg font-medium uppercase tracking-widest text-muted-foreground mb-2">
                Up to
              </span>
              <span className="bg-gradient-to-br from-blue-400 via-primary to-sky-400 bg-clip-text text-transparent drop-shadow-sm">
                {formatCurrency(estimate.aggressive)}
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-medium">
              in potential tax savings identified
            </p>
          </div>

          {/* Inline estimate chips on mobile */}
          <div className="flex items-center gap-3 text-sm sm:hidden">
            <span className="rounded-full bg-card/60 border border-border px-3 py-1.5 font-semibold text-foreground/80">
              {formatCurrency(estimate.conservative)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">low</span>
            </span>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5 font-bold text-primary">
              {formatCurrency(estimate.base)}
              <span className="ml-1 text-xs font-normal text-primary/70">base</span>
            </span>
            <span className="rounded-full bg-card/60 border border-border px-3 py-1.5 font-semibold text-sky-600 dark:text-sky-300">
              {formatCurrency(estimate.aggressive)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">high</span>
            </span>
          </div>

          {/* CTA buttons — visible on first mobile viewport */}
          <div className="w-full space-y-3 pt-2">
            <Button
              className="w-full gap-2 h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all border-0 rounded-xl"
              size="lg"
            >
              <Phone className="h-5 w-5" />
              Contact a Tax Professional
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 h-12 rounded-xl"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Scroll hint on mobile */}
          <p className="text-xs text-muted-foreground/50 sm:hidden animate-pulse">
            Scroll for detailed breakdown
          </p>
        </div>

        {/* Detailed breakdown — below the fold on mobile */}
        <div className="space-y-10 pt-4 sm:pt-0">
          {/* Full estimate cards — desktop only (mobile gets chips above) */}
          <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5 shadow-lg transition-all hover:bg-card/60">
              <PiggyBank className="mb-3 h-5 w-5 text-muted-foreground/70" />
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Conservative</p>
              <p className="text-xl font-bold text-foreground/90">{formatCurrency(estimate.conservative)}</p>
            </div>
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-md p-5 shadow-[0_0_30px_rgba(59,108,245,0.15)] transition-all hover:bg-primary/15 scale-105 z-10">
              <div className="absolute -top-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Base
              </div>
              <DollarSign className="mb-3 h-6 w-6 text-primary" />
              <p className="text-2xl font-extrabold text-primary dark:text-blue-50">{formatCurrency(estimate.base)}</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/40 backdrop-blur-md p-5 shadow-lg transition-all hover:bg-card/60">
              <TrendingUp className="mb-3 h-5 w-5 text-sky-500/70" />
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Aggressive</p>
              <p className="text-xl font-bold text-sky-600 dark:text-sky-300">{formatCurrency(estimate.aggressive)}</p>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card/30 backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground/80">Analysis Confidence</span>
              <span className="font-bold text-primary">{estimate.confidence}%</span>
            </div>
            <Progress
              value={estimate.confidence}
              className="h-2.5 bg-foreground/5 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-blue-400"
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on <strong className="text-foreground/80 font-semibold">{estimate.connectedSources}</strong> of <strong className="text-foreground/80 font-semibold">{estimate.totalSources}</strong> data sources connected ({estimate.percentage}%)
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card/30 backdrop-blur-md p-6 shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Top Strategies Identified</p>
            <ul className="space-y-3">
              {estimate.topStrategies.slice(0, 7).map((s, i) => (
                <li
                  key={s}
                  className="flex items-start gap-3 text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${i * 100 + 500}ms`, animationFillMode: 'both' }}
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                    <DollarSign className="h-3 w-3 text-primary" />
                  </div>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-center text-xs text-muted-foreground/60 leading-relaxed px-4 pb-8">
            These estimates are based on your connected data sources and 435+ tax strategies.
            Actual savings depend on your specific tax situation and require professional review.
          </p>
        </div>
      </div>
    </div>
  );
}
