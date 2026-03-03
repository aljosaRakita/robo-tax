"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Loader2 } from "lucide-react";

interface PlaidLinkButtonProps {
  /** The link_token returned by the server */
  linkToken: string;
  /** The power-up ID that triggered this flow */
  powerUpId: string;
  /** Called after successful token exchange */
  onSuccess: (powerUpId: string) => void;
  /** Called on error */
  onError?: (error: string) => void;
  /** Called when user exits Link without completing */
  onExit?: () => void;
  children?: React.ReactNode;
}

/**
 * Wraps react-plaid-link. Opens Plaid Link when rendered,
 * exchanges the public_token on success, and notifies parent.
 */
export function PlaidLinkButton({
  linkToken,
  powerUpId,
  onSuccess,
  onError,
  onExit,
  children,
}: PlaidLinkButtonProps) {
  const [exchanging, setExchanging] = useState(false);

  const handleSuccess = useCallback(
    async (publicToken: string) => {
      setExchanging(true);
      try {
        const res = await fetch("/api/integrations/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicToken, powerUpId }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          onError?.(data.error ?? "Token exchange failed");
          return;
        }

        onSuccess(powerUpId);
      } catch (err) {
        onError?.(err instanceof Error ? err.message : "Token exchange failed");
      } finally {
        setExchanging(false);
      }
    },
    [powerUpId, onSuccess, onError]
  );

  const handleExit = useCallback(() => {
    onExit?.();
  }, [onExit]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: handleSuccess,
    onExit: handleExit,
  });

  // Auto-open Plaid Link as soon as it's ready
  useEffect(() => {
    if (ready && !exchanging) {
      open();
    }
  }, [ready, open, exchanging]);

  if (exchanging) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting account...
      </div>
    );
  }

  // Fallback button in case auto-open doesn't fire
  if (children) {
    return (
      <button onClick={() => open()} disabled={!ready || exchanging}>
        {children}
      </button>
    );
  }

  return null;
}
