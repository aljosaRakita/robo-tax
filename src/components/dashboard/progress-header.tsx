"use client";

import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

interface ProgressHeaderProps {
  connected: number;
  total: number;
  percentage: number;
}

export function ProgressHeader({
  connected,
  total,
  percentage,
}: ProgressHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <h2 className="text-sm font-semibold sm:text-base">
            Power-Up Progress
          </h2>
        </div>
        <span className="text-sm font-medium tabular-nums text-muted-foreground">
          {connected}/{total} connected ({percentage}%)
        </span>
      </div>
      <Progress
        value={percentage}
        className="h-3 transition-all duration-700 ease-out"
      />
      {percentage === 0 && (
        <p className="text-xs text-muted-foreground">
          Connect your first data source below to get started
        </p>
      )}
      {percentage === 100 && (
        <p className="text-xs font-medium text-green-600">
          All sources connected — you&apos;re ready for a full analysis!
        </p>
      )}
    </div>
  );
}
