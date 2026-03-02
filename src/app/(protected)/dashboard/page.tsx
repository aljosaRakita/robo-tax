"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ProgressHeader } from "@/components/dashboard/progress-header";
import { CategoryStepper } from "@/components/dashboard/category-stepper";
import { PowerUpGrid } from "@/components/dashboard/power-up-grid";
import { SavingsDialog } from "@/components/dashboard/savings-dialog";
import type {
  PowerUp,
  CategoryInfo,
} from "@/lib/types";

interface Stats {
  total: number;
  connected: number;
  percentage: number;
}

export default function DashboardPage() {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    connected: 0,
    percentage: 0,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPowerUps() {
      try {
        const res = await fetch("/api/power-ups");
        const data = await res.json();
        setPowerUps(data.powerUps);
        setCategories(data.categories);
        setStats(data.stats);
      } finally {
        setLoading(false);
      }
    }
    fetchPowerUps();
  }, []);

  const handleToggle = useCallback(
    async (id: string, action: "connect" | "disconnect") => {
      const res = await fetch("/api/power-ups/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ powerUpId: id, action }),
      });

      if (!res.ok) return;

      const data = await res.json();

      setPowerUps((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, connected: action === "connect" } : p
        )
      );
      setStats(data.stats);
    },
    []
  );

  const connectedIds = useMemo(
    () => powerUps.filter((p) => p.connected).map((p) => p.id),
    [powerUps]
  );

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
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-4 pt-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pt-6 pb-24">
      <ProgressHeader
        connected={stats.connected}
        total={stats.total}
        percentage={stats.percentage}
      />

      <Separator />

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

      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-5xl">
          <SavingsDialog
            percentage={stats.percentage}
            connectedIds={connectedIds}
          />
        </div>
      </div>
    </div>
  );
}
