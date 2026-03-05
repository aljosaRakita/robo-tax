import type { SavingsEstimate, StrategyMatch } from "@/lib/types";
import { runStrategyEngine } from "@/lib/strategy-engine";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemoUser } from "@/lib/demo";
import type { Database } from "@/lib/supabase/types";

type StrategyMatchRow = Database["public"]["Tables"]["user_strategy_matches"]["Row"];

interface PowerUpInput {
  id: string;
  savingsWeight: number;
}

const STRATEGY_POOL = [
  "R&D Tax Credit (IRC §41)",
  "Cost Segregation Study",
  "Qualified Business Income Deduction (§199A)",
  "Augusta Rule (IRC §280A)",
  "Captive Insurance (IRC §831(b))",
  "Charitable Remainder Trust",
  "Conservation Easement",
  "Opportunity Zone Deferral (IRC §1400Z-2)",
  "IC-DISC Export Incentive",
  "S-Corp Reasonable Compensation Optimization",
  "Accelerated Depreciation (Bonus §168(k))",
  "Home Office Deduction (§280A)",
  "Health Savings Account Maximization",
  "Retirement Plan Optimization (Cash Balance)",
  "Entity Restructuring — LLC to S-Corp",
  "Tariff Duty Drawback Recovery",
  "Employee Retention Credit (retroactive)",
  "Work Opportunity Tax Credit (WOTC)",
  "Energy Efficiency Credits (§179D / §45L)",
  "State & Local Tax (SALT) Workarounds",
];

// ---- Randomized fallback (original V0 logic) ----

/**
 * Calculates savings estimate based on which power-ups are connected.
 * Used as a fallback when no integration data exists.
 */
export function calculateSavingsFallback(
  allPowerUps: PowerUpInput[],
  connectedIds: Set<string>
): SavingsEstimate {
  const connected = allPowerUps.filter((p) => connectedIds.has(p.id));
  const total = allPowerUps.length;
  const connectedCount = connected.length;
  const percentage = total > 0 ? Math.round((connectedCount / total) * 100) : 0;

  const weightedSum = connected.reduce((sum, p) => {
    const contribution = (3000 + Math.random() * 5000) * p.savingsWeight;
    return sum + contribution;
  }, 0);

  const baseSavings = Math.round(5000 + weightedSum);
  const confidence = Math.min(100, Math.round(percentage * 1.2));

  const strategyCount = Math.max(3, Math.min(STRATEGY_POOL.length, connectedCount * 2));
  const shuffled = [...STRATEGY_POOL].sort(() => Math.random() - 0.5);
  const topStrategies = shuffled.slice(0, strategyCount);

  return {
    conservative: Math.round(baseSavings * 0.6),
    base: baseSavings,
    aggressive: Math.round(baseSavings * 1.5),
    confidence,
    connectedSources: connectedCount,
    totalSources: total,
    percentage,
    topStrategies,
  };
}

// ---- Data-driven calculation via strategy engine ----

/**
 * Run the strategy engine and build a SavingsEstimate from real data.
 * Falls back to randomized calc if the engine produces no matches.
 */
export async function calculateSavings(
  userId: string,
  allPowerUps: PowerUpInput[],
  connectedIds: Set<string>
): Promise<SavingsEstimate> {
  // Demo user: read pre-seeded matches directly, bypass engine
  if (isDemoUser(userId)) {
    return calculateDemoSavings(userId, allPowerUps, connectedIds);
  }

  // Check if user has any integration data
  const admin = createAdminClient();
  const { count } = await admin
    .from("integration_data")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_stale", false);

  if (!count || count === 0) {
    return calculateSavingsFallback(allPowerUps, connectedIds);
  }

  // Run the strategy engine
  const engineResults = await runStrategyEngine(userId);

  if (engineResults.length === 0) {
    return calculateSavingsFallback(allPowerUps, connectedIds);
  }

  // Fetch strategy titles for display
  const { data: strategies } = await admin
    .from("tax_strategies")
    .select("id, title");

  const titleMap = new Map(
    (strategies ?? []).map((s) => [s.id, s.title])
  );

  // Also fetch persisted matches to include status
  const { data: rawMatchRows } = await admin
    .from("user_strategy_matches")
    .select("*")
    .eq("user_id", userId);

  const matchRows = (rawMatchRows ?? []) as StrategyMatchRow[];
  const matchMap = new Map(matchRows.map((m) => [m.strategy_id, m]));

  // Build strategy matches
  const strategyMatches: StrategyMatch[] = engineResults.map((r) => {
    const persisted = matchMap.get(r.strategyId);
    return {
      strategyId: r.strategyId,
      strategyTitle: titleMap.get(r.strategyId) ?? r.strategyId,
      estimatedLow: r.estimatedLow,
      estimatedBase: r.estimatedBase,
      estimatedHigh: r.estimatedHigh,
      confidence: r.confidence,
      reasoning: r.reasoning,
      evidence: r.evidence,
      status: (persisted?.status as StrategyMatch["status"]) ?? "identified",
    };
  });

  // Sort by estimated savings descending
  strategyMatches.sort((a, b) => b.estimatedBase - a.estimatedBase);

  // Aggregate totals
  const totalBase = strategyMatches.reduce((s, m) => s + m.estimatedBase, 0);
  const totalLow = strategyMatches.reduce((s, m) => s + m.estimatedLow, 0);
  const totalHigh = strategyMatches.reduce((s, m) => s + m.estimatedHigh, 0);
  const avgConfidence =
    strategyMatches.length > 0
      ? Math.round(
          strategyMatches.reduce((s, m) => s + m.confidence, 0) /
            strategyMatches.length
        )
      : 0;

  const total = allPowerUps.length;
  const connectedCount = connectedIds.size;
  const percentage = total > 0 ? Math.round((connectedCount / total) * 100) : 0;

  return {
    conservative: totalLow,
    base: totalBase,
    aggressive: totalHigh,
    confidence: avgConfidence,
    connectedSources: connectedCount,
    totalSources: total,
    percentage,
    topStrategies: strategyMatches.slice(0, 10).map((m) => m.strategyTitle),
    strategyMatches,
  };
}

// ---- Demo-specific calculation ----

async function calculateDemoSavings(
  userId: string,
  allPowerUps: PowerUpInput[],
  connectedIds: Set<string>
): Promise<SavingsEstimate> {
  const admin = createAdminClient();

  // Read pre-seeded user_strategy_matches
  const { data: matchRows } = await admin
    .from("user_strategy_matches")
    .select("*")
    .eq("user_id", userId);

  const matches = (matchRows ?? []) as StrategyMatchRow[];

  // Fetch strategy titles
  const { data: strategies } = await admin
    .from("tax_strategies")
    .select("id, title");
  const titleMap = new Map((strategies ?? []).map((s) => [s.id, s.title]));

  const strategyMatches: StrategyMatch[] = matches.map((m) => ({
    strategyId: m.strategy_id,
    strategyTitle: titleMap.get(m.strategy_id) ?? m.strategy_id,
    estimatedLow: Number(m.estimated_low),
    estimatedBase: Number(m.estimated_base),
    estimatedHigh: Number(m.estimated_high),
    confidence: m.confidence,
    reasoning: "",
    evidence: {},
    status: (m.status as StrategyMatch["status"]) ?? "identified",
  }));

  strategyMatches.sort((a, b) => b.estimatedBase - a.estimatedBase);

  // Fixed hero numbers for the demo
  const aggressive = 365632;
  const base = 243755;
  const conservative = 146253;

  const total = allPowerUps.length;
  const connectedCount = connectedIds.size;
  const percentage = total > 0 ? Math.round((connectedCount / total) * 100) : 0;

  return {
    conservative,
    base,
    aggressive,
    confidence: 90,
    connectedSources: connectedCount,
    totalSources: total,
    percentage,
    topStrategies: strategyMatches.slice(0, 10).map((m) => m.strategyTitle),
    strategyMatches,
  };
}
