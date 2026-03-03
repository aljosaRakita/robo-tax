"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProgressHeader } from "@/components/dashboard/progress-header";
import { CategoryStepper } from "@/components/dashboard/category-stepper";
import { PowerUpGrid } from "@/components/dashboard/power-up-grid";
import { SavingsDialog } from "@/components/dashboard/savings-dialog";
import { CategoryPrompt } from "@/components/dashboard/category-prompt";
import type {
  PowerUp,
  CategoryInfo,
  IntegrationStatus,
} from "@/lib/types";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dismissedPrompts, setDismissedPrompts] = useState<Set<string>>(new Set());

  // Fetch power-ups and integration statuses
  const fetchPowerUps = useCallback(async () => {
    try {
      const [puRes, statusRes] = await Promise.all([
        fetch("/api/power-ups"),
        fetch("/api/integrations/status"),
      ]);
      const puData = await puRes.json();
      const statusData = await statusRes.json().catch(() => ({ statuses: [] }));

      // Build a status lookup from integration statuses
      const statusMap = new Map<
        string,
        { integrationStatus: IntegrationStatus; lastSyncedAt: string | null; provider: string | null }
      >();
      if (statusData.statuses) {
        for (const s of statusData.statuses) {
          statusMap.set(s.powerUpId, {
            integrationStatus: s.integrationStatus,
            lastSyncedAt: s.lastSyncedAt,
            provider: s.provider,
          });
        }
      }

      // Enrich power-ups with integration status
      const enriched: PowerUp[] = (puData.powerUps ?? []).map((p: PowerUp) => {
        const st = statusMap.get(p.id);
        return {
          ...p,
          provider: st?.provider ?? p.provider,
          integrationStatus: st?.integrationStatus as IntegrationStatus | undefined,
          lastSyncedAt: st?.lastSyncedAt,
        };
      });

      setPowerUps(enriched);
      setCategories(puData.categories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPowerUps();
  }, [fetchPowerUps]);

  // Handle post-Plaid redirect URL params
  useEffect(() => {
    const plaidSuccess = searchParams.get("plaid_success");
    if (plaidSuccess) {
      fetchPowerUps();
      const url = new URL(window.location.href);
      url.searchParams.delete("plaid_success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, fetchPowerUps]);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y > 150) setIsScrolled(true);
      else if (y < 20) setIsScrolled(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggle = useCallback(
    async (id: string, action: "connect" | "disconnect"): Promise<{
      requiresPlaid?: boolean;
      linkToken?: string;
    } | void> => {
      // Optimistic update
      setPowerUps((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, connected: action === "connect" } : p
        )
      );

      const res = await fetch("/api/power-ups/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ powerUpId: id, action }),
      });

      const data = await res.json();

      // If server says this needs Plaid, revert optimistic update and return link token
      if (data.requiresPlaid && data.linkToken) {
        setPowerUps((prev) =>
          prev.map((p) => (p.id === id ? { ...p, connected: false } : p))
        );
        return { requiresPlaid: true, linkToken: data.linkToken };
      }

      // After successful connect, refetch statuses after a brief delay for background sync
      if (action === "connect") {
        setTimeout(() => fetchPowerUps(), 1500);
      }
    },
    [fetchPowerUps]
  );

  const connectedIds = useMemo(
    () => powerUps.filter((p) => p.connected).map((p) => p.id),
    [powerUps]
  );

  const stats = useMemo(() => {
    const total = powerUps.length;
    const connected = powerUps.filter((p) => p.connected).length;
    return {
      total,
      connected,
      percentage: total > 0 ? Math.round((connected / total) * 100) : 0,
    };
  }, [powerUps]);

  const { connectedByCategory, totalByCategory } = useMemo(() => {
    const connected: Record<string, number> = {};
    const total: Record<string, number> = {};
    for (const p of powerUps) {
      total[p.category] = (total[p.category] ?? 0) + 1;
      if (p.connected) {
        connected[p.category] = (connected[p.category] ?? 0) + 1;
      }
    }
    return { connectedByCategory: connected, totalByCategory: total };
  }, [powerUps]);

  const currentCategory = categories[currentStep];

  function handleStepChange(step: number) {
    setCurrentStep(step);
    setSearch("");
    setDismissedPrompts((prev) => {
      const next = new Set(prev);
      next.delete(categories[step]?.id ?? "");
      return next;
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 p-6 pt-10">
        <Skeleton className="h-24 w-full rounded-2xl bg-foreground/5" />
        <Skeleton className="h-12 w-full rounded-xl bg-foreground/5" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl bg-foreground/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6 pt-10 pb-32">
      <div className="sticky top-16 z-40 -mx-6 px-6 pb-4 pt-1">
        <ProgressHeader
          connected={stats.connected}
          total={stats.total}
          percentage={stats.percentage}
          isCompact={isScrolled}
        />
      </div>

      <div className="space-y-8">
        <Separator className="bg-border" />

        <CategoryStepper
          categories={categories}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          connectedByCategory={connectedByCategory}
          totalByCategory={totalByCategory}
        />

        {currentCategory && (
          <PowerUpGrid
            powerUps={powerUps}
            category={currentCategory.id}
            search={search}
            onSearchChange={setSearch}
            onToggle={handleToggle}
          />
        )}

        {currentCategory && currentStep < categories.length - 1 && (
          <CategoryPrompt
            connectedInCategory={connectedByCategory[currentCategory.id] ?? 0}
            totalInCategory={totalByCategory[currentCategory.id] ?? 0}
            nextCategoryLabel={categories[currentStep + 1]?.label}
            onContinue={() => handleStepChange(currentStep + 1)}
            dismissed={dismissedPrompts.has(currentCategory.id)}
            onDismiss={() =>
              setDismissedPrompts((prev) => new Set(prev).add(currentCategory.id))
            }
          />
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 p-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl">
          <SavingsDialog
            percentage={stats.percentage}
            connectedIds={connectedIds}
          />
        </div>
      </div>
    </div>
  );
}
