"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PowerUpCard } from "@/components/dashboard/power-up-card";
import type { PowerUp, PowerUpCategory } from "@/lib/types";

interface PowerUpGridProps {
  powerUps: PowerUp[];
  category: PowerUpCategory;
  search: string;
  onSearchChange: (value: string) => void;
  onToggle: (id: string, action: "connect" | "disconnect") => Promise<void>;
}

export function PowerUpGrid({
  powerUps,
  category,
  search,
  onSearchChange,
  onToggle,
}: PowerUpGridProps) {
  const filtered = useMemo(() => {
    return powerUps.filter((p) => {
      const matchesCategory = p.category === category;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [powerUps, category, search]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search institutions, brokerages, or CPAs..."
          className="pl-10 bg-foreground/[0.02] border-border h-11 rounded-xl"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-border bg-foreground/[0.01]">
          <p className="text-sm text-muted-foreground">
            {search
              ? `No power-ups found matching "${search}"`
              : "No power-ups in this category"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((powerUp) => (
            <PowerUpCard
              key={powerUp.id}
              powerUp={powerUp}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
