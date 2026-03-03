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
      setShowConfetti(true);
    } catch {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!estimate) {
    return null;
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center bg-background px-4 py-12 overflow-hidden selection:bg-emerald-500/30">
      <div className="pointer-events-none absolute -top-[20%] left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 opacity-50 blur-[120px]" />

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 flex items-start justify-center z-50">
          <Confetti
            particleCount={250}
            force={0.7}
            duration={5000}
            colors={["#059669", "#10b981", "#34d399", "#0d9488", "#14b8a6", "#d97706", "#fbbf24"]}
            particleShape="mix"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <PartyPopper className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 border border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.15)] z-10 -mx-2">
              <BadgeDollarSign className="h-8 w-8 text-emerald-300" />
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <Banknote className="h-6 w-6 text-teal-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
              <span className="block text-lg font-medium uppercase tracking-widest text-muted-foreground mb-2">
                Up to
              </span>
              <span className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
                {formatCurrency(estimate.aggressive)}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              in potential tax savings identified
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-card/40 backdrop-blur-md p-5 shadow-lg transition-all hover:bg-card/60">
            <PiggyBank className="mb-3 h-5 w-5 text-muted-foreground/70" />
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Conservative</p>
            <p className="text-xl font-bold text-foreground/90">{formatCurrency(estimate.conservative)}</p>
          </div>
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all hover:bg-emerald-500/15 scale-105 z-10">
            <div className="absolute -top-3 bg-emerald-500 text-background text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              Base
            </div>
            <DollarSign className="mb-3 h-6 w-6 text-emerald-400" />
            <p className="text-2xl font-extrabold text-emerald-50">{formatCurrency(estimate.base)}</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-card/40 backdrop-blur-md p-5 shadow-lg transition-all hover:bg-card/60">
            <TrendingUp className="mb-3 h-5 w-5 text-teal-400/70" />
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Aggressive</p>
            <p className="text-xl font-bold text-teal-300">{formatCurrency(estimate.aggressive)}</p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-card/30 backdrop-blur-md p-6 shadow-xl">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground/80">Analysis Confidence</span>
            <span className="font-bold text-emerald-400">{estimate.confidence}%</span>
          </div>
          <Progress 
            value={estimate.confidence} 
            className="h-2.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-600 [&>div]:to-emerald-400" 
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Based on <strong className="text-foreground/80 font-semibold">{estimate.connectedSources}</strong> of <strong className="text-foreground/80 font-semibold">{estimate.totalSources}</strong> data sources connected ({estimate.percentage}%)
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-card/30 backdrop-blur-md p-6 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Top Strategies Identified</p>
          <ul className="space-y-3">
            {estimate.topStrategies.slice(0, 7).map((s, i) => (
              <li
                key={s}
                className="flex items-start gap-3 text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2"
                style={{ animationDelay: `${i * 100 + 500}ms`, animationFillMode: 'both' }}
              >
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <DollarSign className="h-3 w-3 text-emerald-400" />
                </div>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 pt-4">
          <Button 
            className="w-full gap-2 h-14 text-base font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all border-0 rounded-xl" 
            size="lg"
          >
            <Phone className="h-5 w-5" />
            Contact a Tax Professional
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2 h-12 border-white/10 bg-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all rounded-xl"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 leading-relaxed px-4">
          These estimates are based on your connected data sources and 435+ tax strategies.
          Actual savings depend on your specific tax situation and require professional review.
        </p>
      </div>
    </div>
  );
}
