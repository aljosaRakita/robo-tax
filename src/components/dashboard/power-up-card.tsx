"use client";

import { useState } from "react";
import { Loader2, Check, Plug } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PowerUp } from "@/lib/types";

const BRAND_COLORS: Record<string, string> = {
  plaid: "bg-emerald-600",
  chase: "bg-blue-700",
  boa: "bg-red-600",
  "wells-fargo": "bg-yellow-600",
  fidelity: "bg-green-700",
  robinhood: "bg-lime-500",
  "capital-one": "bg-red-700",
  quickbooks: "bg-green-600",
  xero: "bg-sky-500",
  freshbooks: "bg-blue-600",
  wave: "bg-indigo-500",
  sage: "bg-emerald-500",
  coinbase: "bg-blue-500",
  kraken: "bg-purple-700",
  gemini: "bg-cyan-500",
  "binance-us": "bg-yellow-500",
  zillow: "bg-blue-600",
  redfin: "bg-red-500",
  costar: "bg-blue-800",
  adp: "bg-red-600",
  gusto: "bg-orange-500",
  paychex: "bg-blue-700",
  rippling: "bg-purple-600",
  gmail: "bg-red-500",
  "google-drive": "bg-yellow-500",
  jira: "bg-blue-600",
  github: "bg-neutral-900",
  gitlab: "bg-orange-600",
  slack: "bg-purple-500",
  asana: "bg-rose-500",
  stripe: "bg-violet-600",
};

interface PowerUpCardProps {
  powerUp: PowerUp;
  onToggle: (id: string, action: "connect" | "disconnect") => Promise<void>;
}

export function PowerUpCard({ powerUp, onToggle }: PowerUpCardProps) {
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const bgColor = BRAND_COLORS[powerUp.id] ?? "bg-muted";

  async function handleClick() {
    setLoading(true);
    try {
      await onToggle(
        powerUp.id,
        powerUp.connected ? "disconnect" : "connect"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      className={cn(
        "flex h-full flex-col transition-all duration-200",
        powerUp.connected && "ring-2 ring-green-500/40"
      )}
    >
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg",
            (imgError || !powerUp.logoUrl) && bgColor,
            (imgError || !powerUp.logoUrl) && "text-sm font-bold text-white"
          )}
        >
          {!imgError && powerUp.logoUrl ? (
            <img
              src={powerUp.logoUrl}
              alt={powerUp.name}
              width={40}
              height={40}
              className="h-10 w-10 object-contain p-1.5"
              onError={() => setImgError(true)}
            />
          ) : (
            powerUp.name.charAt(0)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-sm leading-tight">
            {powerUp.name}
          </CardTitle>
        </div>
        {powerUp.connected && (
          <Badge
            variant="secondary"
            className="shrink-0 bg-green-100 text-green-700"
          >
            <Check className="mr-0.5 h-3 w-3" />
            Connected
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-3">
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {powerUp.description}
        </p>
        <Button
          variant={powerUp.connected ? "outline" : "default"}
          size="sm"
          className="mt-auto w-full"
          disabled={loading}
          onClick={handleClick}
        >
          {loading ? (
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
          ) : powerUp.connected ? null : (
            <Plug className="mr-2 h-3.5 w-3.5" />
          )}
          {powerUp.connected ? "Disconnect" : "Connect"}
        </Button>
      </CardContent>
    </Card>
  );
}
