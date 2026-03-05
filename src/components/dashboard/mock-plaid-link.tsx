"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockPlaidLinkProps {
  powerUpId: string;
  onSuccess: (powerUpId: string) => void;
  onExit?: () => void;
  onError?: (error: string) => void;
}

const BANK_LOGOS = [
  { name: "Chase", color: "bg-blue-700" },
  { name: "Bank of America", color: "bg-red-600" },
  { name: "Wells Fargo", color: "bg-yellow-600" },
  { name: "Fidelity", color: "bg-green-700" },
  { name: "Capital One", color: "bg-red-700" },
  { name: "Vanguard", color: "bg-red-800" },
];

type Phase = "select" | "connecting" | "connected" | "syncing";

export function MockPlaidLink({
  powerUpId,
  onSuccess,
  onExit,
}: MockPlaidLinkProps) {
  const [phase, setPhase] = useState<Phase>("select");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1 → 2: Auto-select bank after 1s
    timers.push(setTimeout(() => setPhase("connecting"), 1000));

    // Phase 2 → 3: Connected after 2.5s
    timers.push(setTimeout(() => setPhase("connected"), 2500));

    // Phase 3 → 4: Syncing after 3.5s
    timers.push(setTimeout(() => setPhase("syncing"), 3500));

    // Auto-close & trigger success after 4.5s
    timers.push(
      setTimeout(async () => {
        // Call demo bulk connect API
        try {
          await fetch("/api/power-ups/demo-connect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ powerUpId }),
          });
        } catch {
          // Silently continue — demo should not fail
        }
        onSuccess(powerUpId);
      }, 4500)
    );

    return () => timers.forEach(clearTimeout);
  }, [powerUpId, onSuccess]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onExit}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Plaid branding */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20">
            <span className="text-lg font-bold text-emerald-500">P</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Plaid</h3>
            <p className="text-xs text-muted-foreground">Secure bank connection</p>
          </div>
        </div>

        {/* Phase: Select Bank */}
        {phase === "select" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">
              Select your bank
            </p>
            <div className="grid grid-cols-2 gap-3">
              {BANK_LOGOS.map((bank) => (
                <div
                  key={bank.name}
                  className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-foreground/[0.02] p-3 hover:bg-foreground/[0.05] transition-colors cursor-pointer"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold",
                      bank.color
                    )}
                  >
                    {bank.name.charAt(0)}
                  </div>
                  <span className="text-sm text-foreground truncate">
                    {bank.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phase: Connecting */}
        {phase === "connecting" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Connecting to your accounts...
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                This may take a moment
              </p>
            </div>
          </div>
        )}

        {/* Phase: Connected */}
        {phase === "connected" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-7 w-7 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Connected!
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                13 financial accounts found
              </p>
            </div>
          </div>
        )}

        {/* Phase: Syncing */}
        {phase === "syncing" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-7 w-7 text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Syncing 24 months of data...
              </p>
              <div className="mt-3 h-1.5 w-48 overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full animate-pulse rounded-full bg-emerald-500 w-3/4" />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-1 text-xs text-muted-foreground/60">
          <span>Secured by</span>
          <span className="font-medium text-emerald-500/80">Plaid</span>
        </div>
      </div>
    </div>
  );
}
