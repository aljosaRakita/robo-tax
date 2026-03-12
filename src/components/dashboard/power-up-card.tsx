"use client";

import { useState } from "react";
import {
  Loader2,
  Check,
  Plug,
  RefreshCw,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaidLinkButton } from "@/components/dashboard/plaid-link";
import { MockPlaidLink } from "@/components/dashboard/mock-plaid-link";
import type { PowerUp, IntegrationStatus } from "@/lib/types";

const BRAND_COLORS: Record<string, string> = {
  plaid: "bg-emerald-600/20 text-emerald-500",
  chase: "bg-blue-700/20 text-blue-500",
  boa: "bg-red-600/20 text-red-500",
  "wells-fargo": "bg-yellow-600/20 text-yellow-500",
  fidelity: "bg-green-700/20 text-green-500",
  robinhood: "bg-lime-500/20 text-lime-500",
  "capital-one": "bg-red-700/20 text-red-500",
  quickbooks: "bg-green-600/20 text-green-500",
  xero: "bg-sky-500/20 text-sky-500",
  freshbooks: "bg-blue-600/20 text-blue-500",
  wave: "bg-indigo-500/20 text-indigo-500",
  sage: "bg-emerald-500/20 text-emerald-500",
  coinbase: "bg-blue-500/20 text-blue-500",
  kraken: "bg-purple-700/20 text-purple-500",
  gemini: "bg-cyan-500/20 text-cyan-500",
  "binance-us": "bg-yellow-500/20 text-yellow-500",
  zillow: "bg-blue-600/20 text-blue-500",
  redfin: "bg-red-500/20 text-red-500",
  costar: "bg-blue-800/20 text-blue-500",
  adp: "bg-red-600/20 text-red-500",
  gusto: "bg-orange-500/20 text-orange-500",
  paychex: "bg-blue-700/20 text-blue-500",
  rippling: "bg-purple-600/20 text-purple-500",
  gmail: "bg-red-500/20 text-red-500",
  "google-drive": "bg-yellow-500/20 text-yellow-500",
  jira: "bg-blue-600/20 text-blue-500",
  github: "bg-neutral-500/20 text-neutral-300",
  gitlab: "bg-orange-600/20 text-orange-500",
  slack: "bg-purple-500/20 text-purple-500",
  asana: "bg-rose-500/20 text-rose-500",
  stripe: "bg-violet-600/20 text-violet-500",
  "stride-health": "bg-violet-500/20 text-violet-500",
  "healthcare-gov": "bg-blue-600/20 text-blue-500",
  vanguard: "bg-red-700/20 text-red-500",
  schwab: "bg-sky-600/20 text-sky-500",
  expensify: "bg-green-900/20 text-green-500",
  hurdlr: "bg-emerald-500/20 text-emerald-500",
  "home-office-calc": "bg-slate-600/20 text-slate-400",
  "home-office-actual": "bg-slate-700/20 text-slate-400",
  mileiq: "bg-sky-500/20 text-sky-500",
  everlance: "bg-emerald-600/20 text-emerald-500",
  collective: "bg-violet-500/20 text-violet-500",
};

function statusLabel(status: IntegrationStatus | undefined): {
  text: string;
  icon: React.ReactNode;
  color: string;
} {
  switch (status) {
    case "syncing":
      return {
        text: "Syncing",
        icon: <RefreshCw className="mr-1 h-3 w-3 animate-spin" />,
        color: "bg-amber-500/20 text-amber-500",
      };
    case "synced":
      return {
        text: "Synced",
        icon: <Check className="mr-1 h-3 w-3" />,
        color: "bg-primary/20 text-primary",
      };
    case "error":
      return {
        text: "Error",
        icon: <AlertCircle className="mr-1 h-3 w-3" />,
        color: "bg-destructive/20 text-destructive",
      };
    case "connected":
      return {
        text: "Connected",
        icon: <Check className="mr-1 h-3 w-3" />,
        color: "bg-primary/20 text-primary",
      };
    case "pending":
      return {
        text: "Pending",
        icon: <Clock className="mr-1 h-3 w-3" />,
        color: "bg-muted text-muted-foreground",
      };
    default:
      return {
        text: "Connected",
        icon: <Check className="mr-1 h-3 w-3" />,
        color: "bg-primary/20 text-primary",
      };
  }
}

function formatSyncTime(iso: string | null | undefined): string {
  if (!iso) return "Just now";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

interface PowerUpCardProps {
  powerUp: PowerUp;
  onToggle: (id: string, action: "connect" | "disconnect") => Promise<{
    requiresPlaid?: boolean;
    requiresDemoPlaid?: boolean;
    requiresOAuth?: boolean;
    oauthUrl?: string;
    linkToken?: string;
  } | void>;
  onPlaidSuccess?: (powerUpId: string) => void;
  demoTarget?: boolean;
  onDemoPlaidComplete?: () => void;
}

export function PowerUpCard({ powerUp, onToggle, onPlaidSuccess, demoTarget, onDemoPlaidComplete }: PowerUpCardProps) {
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [showDemoPlaid, setShowDemoPlaid] = useState(false);
  const bgColor = BRAND_COLORS[powerUp.id] ?? "bg-foreground/5 text-muted-foreground";

  const status = statusLabel(powerUp.integrationStatus);

  async function handleClick() {
    setLoading(true);
    try {
      const result = await onToggle(
        powerUp.id,
        powerUp.connected ? "disconnect" : "connect"
      );

      // If the server returned a demo Plaid flag, show mock modal
      if (result && "requiresDemoPlaid" in result && result.requiresDemoPlaid) {
        setShowDemoPlaid(true);
        return;
      }

      // If the server returned a Plaid link token, open Plaid Link
      if (result && "requiresPlaid" in result && result.requiresPlaid && result.linkToken) {
        setPlaidLinkToken(result.linkToken);
        return;
      }

      // If the server returned an OAuth URL, redirect to it
      if (result && "requiresOAuth" in result && result.requiresOAuth && result.oauthUrl) {
        window.location.href = result.oauthUrl;
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  function handlePlaidSuccess() {
    setPlaidLinkToken(null);
    onPlaidSuccess?.(powerUp.id);
  }

  function handlePlaidExit() {
    setPlaidLinkToken(null);
    setLoading(false);
  }

  function handlePlaidError(error: string) {
    console.error("[plaid-link]", error);
    setPlaidLinkToken(null);
    setLoading(false);
  }

  return (
    <>
      {showDemoPlaid && (
        <MockPlaidLink
          powerUpId={powerUp.id}
          onSuccess={() => {
            setShowDemoPlaid(false);
            setLoading(false);
            onDemoPlaidComplete?.();
          }}
          onExit={() => {
            setShowDemoPlaid(false);
            setLoading(false);
          }}
        />
      )}

      {plaidLinkToken && (
        <PlaidLinkButton
          linkToken={plaidLinkToken}
          powerUpId={powerUp.id}
          onSuccess={handlePlaidSuccess}
          onExit={handlePlaidExit}
          onError={handlePlaidError}
        />
      )}

      <Card
        className={cn(
          "flex h-full flex-col transition-all duration-300 border-border/50 bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-border",
          powerUp.connected && "opacity-75 bg-foreground/[0.01] border-transparent hover:border-border/50",
          demoTarget && !powerUp.connected && "animate-breathe"
        )}
      >
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/50",
              bgColor,
              (imgError || !powerUp.logoUrl) && "text-lg font-bold"
            )}
          >
            {!imgError && powerUp.logoUrl ? (
              <img
                src={powerUp.logoUrl}
                alt={powerUp.name}
                width={48}
                height={48}
                className="h-12 w-12 object-contain p-2.5 drop-shadow-md"
                onError={() => setImgError(true)}
              />
            ) : (
              powerUp.name.charAt(0)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-medium leading-tight text-foreground">
              {powerUp.name}
            </CardTitle>
          </div>
          {powerUp.connected && (
            <Badge
              variant="secondary"
              className={cn(
                "shrink-0 border-none",
                status.color
              )}
            >
              {status.icon}
              {status.text}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between gap-5">
          {powerUp.connected ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                {powerUp.integrationStatus === "synced"
                  ? "Data Synced"
                  : powerUp.integrationStatus === "syncing"
                    ? "Syncing Data..."
                    : powerUp.integrationStatus === "error"
                      ? "Sync Error"
                      : "Account Connected"}
              </p>
              <p className="text-xs text-muted-foreground">
                {powerUp.integrationStatus === "synced" && powerUp.lastSyncedAt
                  ? `Last synced: ${formatSyncTime(powerUp.lastSyncedAt)}`
                  : powerUp.integrationStatus === "syncing"
                    ? "Fetching your financial data..."
                    : powerUp.integrationStatus === "error"
                      ? "Reconnect to fix the issue"
                      : "Data sync will begin shortly"}
              </p>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {powerUp.description}
            </p>
          )}

          {powerUp.connected ? (
            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs text-muted-foreground opacity-70">
                {powerUp.provider ? `via ${powerUp.provider}` : "Active Connection"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 text-xs text-muted-foreground hover:text-destructive px-3"
                disabled={loading}
                onClick={handleClick}
              >
                {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              className="mt-auto w-full transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
              onClick={handleClick}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plug className="mr-2 h-4 w-4" />
              )}
              Connect
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
