// ============================================================
// Strategy Engine
// Evaluates strategy_triggers against integration_data to
// produce per-user savings matches.
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type IntegrationDataRow = Database["public"]["Tables"]["integration_data"]["Row"];
type StrategyTriggerRow = Database["public"]["Tables"]["strategy_triggers"]["Row"];

// ---- Condition evaluator types ----

interface LeafCondition {
  field: string;
  op: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "exists";
  value?: unknown;
}

interface AndCondition {
  and: ConditionNode[];
}

interface OrCondition {
  or: ConditionNode[];
}

type ConditionNode = LeafCondition | AndCondition | OrCondition;

// ---- Helpers ----

/**
 * Resolve a dot-path like "summary.net_income" from a nested object.
 */
function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((cur, key) => {
    if (cur !== null && cur !== undefined && typeof cur === "object") {
      return (cur as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * Evaluate a single condition node against a data payload.
 */
export function evaluateCondition(
  node: ConditionNode,
  data: Record<string, unknown>
): boolean {
  if ("and" in node) {
    return node.and.every((child) => evaluateCondition(child, data));
  }
  if ("or" in node) {
    return node.or.some((child) => evaluateCondition(child, data));
  }

  // Leaf condition
  const actual = resolvePath(data, node.field);

  switch (node.op) {
    case "exists":
      return actual !== undefined && actual !== null;
    case "eq":
      return actual === node.value;
    case "neq":
      return actual !== node.value;
    case "gt":
      return typeof actual === "number" && actual > (node.value as number);
    case "gte":
      return typeof actual === "number" && actual >= (node.value as number);
    case "lt":
      return typeof actual === "number" && actual < (node.value as number);
    case "lte":
      return typeof actual === "number" && actual <= (node.value as number);
    case "contains":
      if (Array.isArray(actual)) return actual.includes(node.value);
      if (typeof actual === "string")
        return actual.includes(String(node.value));
      return false;
    default:
      return false;
  }
}

/**
 * Evaluate a savings formula against integration data.
 *
 * Supported formats:
 *   "fixed:1500"            → 1500
 *   "net_income * 0.20"     → data.net_income * 0.20
 *   "revenue * 0.065"       → data.revenue * 0.065
 */
export function evaluateFormula(
  formula: string,
  data: Record<string, unknown>
): number {
  // Fixed amount
  if (formula.startsWith("fixed:")) {
    return parseFloat(formula.slice(6)) || 0;
  }

  // Simple "field * factor" or "field * factor + offset"
  const mulMatch = formula.match(
    /^([a-zA-Z_][a-zA-Z0-9_.]*)\s*\*\s*([0-9.]+)(?:\s*\+\s*([0-9.]+))?$/
  );
  if (mulMatch) {
    const fieldVal = Number(resolvePath(data, mulMatch[1])) || 0;
    const factor = parseFloat(mulMatch[2]) || 0;
    const offset = parseFloat(mulMatch[3]) || 0;
    return fieldVal * factor + offset;
  }

  // Simple "field * factor - offset"
  const subMatch = formula.match(
    /^([a-zA-Z_][a-zA-Z0-9_.]*)\s*\*\s*([0-9.]+)\s*-\s*([0-9.]+)$/
  );
  if (subMatch) {
    const fieldVal = Number(resolvePath(data, subMatch[1])) || 0;
    const factor = parseFloat(subMatch[2]) || 0;
    const offset = parseFloat(subMatch[3]) || 0;
    return fieldVal * factor - offset;
  }

  // Fallback: try as plain number
  const n = parseFloat(formula);
  return isNaN(n) ? 0 : n;
}

/**
 * Compute confidence score (0-100).
 *   dataCompleteness × 0.5  (how many required data types are present)
 *   recency × 0.3           (how fresh the data is)
 *   specificity × 0.2       (how specific the trigger condition is)
 */
function computeConfidence(
  requiredPresent: number,
  requiredTotal: number,
  fetchedAt: string | null,
  conditionDepth: number
): number {
  // Data completeness: ratio of required data types that exist
  const completeness =
    requiredTotal > 0 ? requiredPresent / requiredTotal : 1;

  // Recency: 1.0 if < 1 day old, decays to 0.3 at 30 days
  let recency = 0.5;
  if (fetchedAt) {
    const ageMs = Date.now() - new Date(fetchedAt).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    recency = Math.max(0.3, 1.0 - ageDays / 30);
  }

  // Specificity: deeper conditions = more specific
  const specificity = Math.min(1, conditionDepth / 3);

  const raw = completeness * 0.5 + recency * 0.3 + specificity * 0.2;
  return Math.round(Math.min(100, raw * 100));
}

/** Count the depth/leaf-count of a condition tree */
function conditionDepth(node: ConditionNode): number {
  if ("and" in node) return node.and.reduce((s, c) => s + conditionDepth(c), 0);
  if ("or" in node) return node.or.reduce((s, c) => s + conditionDepth(c), 0);
  return 1;
}

// ---- Main engine ----

export interface StrategyMatchResult {
  strategyId: string;
  triggerId: string;
  estimatedLow: number;
  estimatedBase: number;
  estimatedHigh: number;
  confidence: number;
  evidence: Record<string, unknown>;
  reasoning: string;
}

/**
 * Run the strategy engine for a given user.
 * 1. Fetch all integration_data for the user
 * 2. Fetch all enabled strategy_triggers
 * 3. Evaluate each trigger against matching data
 * 4. Compute savings and confidence
 * 5. Upsert results into user_strategy_matches
 *
 * Returns the array of matches produced.
 */
export async function runStrategyEngine(
  userId: string
): Promise<StrategyMatchResult[]> {
  const admin = createAdminClient();

  // 1. Fetch user's integration data
  const { data: rawIntegrationRows } = await admin
    .from("integration_data")
    .select("*")
    .eq("user_id", userId)
    .eq("is_stale", false);

  const integrationRows = (rawIntegrationRows ?? []) as IntegrationDataRow[];

  if (!integrationRows || integrationRows.length === 0) {
    return [];
  }

  // Index by (provider, data_type)
  const dataIndex = new Map<
    string,
    { data: Record<string, unknown>; fetchedAt: string }
  >();
  for (const row of integrationRows) {
    const key = `${row.provider}::${row.data_type}`;
    dataIndex.set(key, {
      data: row.data as Record<string, unknown>,
      fetchedAt: row.fetched_at,
    });
  }

  // Track which providers the user has data for
  const userProviders = new Set(integrationRows.map((r) => r.provider));

  // 2. Fetch enabled strategy triggers
  const { data: rawTriggers } = await admin
    .from("strategy_triggers")
    .select("*")
    .eq("enabled", true);

  const triggers = (rawTriggers ?? []) as StrategyTriggerRow[];

  if (triggers.length === 0) {
    return [];
  }

  // 3. Evaluate each trigger
  const matches: StrategyMatchResult[] = [];

  for (const trigger of triggers) {
    const key = `${trigger.provider}::${trigger.data_type}`;
    const entry = dataIndex.get(key);
    if (!entry) continue; // user doesn't have this data

    // Check requires_all: all listed data_types must exist for this provider
    const requiresAll = (trigger.requires_all as string[]) ?? [];
    let allPresent = true;
    for (const req of requiresAll) {
      if (!dataIndex.has(`${trigger.provider}::${req}`)) {
        allPresent = false;
        break;
      }
    }
    if (!allPresent) continue;

    // Merge all data from this provider into a flat object for condition evaluation
    const mergedData: Record<string, unknown> = {};
    for (const [k, v] of dataIndex.entries()) {
      if (k.startsWith(`${trigger.provider}::`)) {
        const dataType = k.split("::")[1];
        mergedData[dataType] = v.data;
        // Also spread top-level keys for convenience
        if (typeof v.data === "object" && v.data !== null) {
          Object.assign(mergedData, v.data);
        }
      }
    }

    // Evaluate condition
    const condition = trigger.condition as unknown as ConditionNode;
    const hasCondition =
      condition &&
      typeof condition === "object" &&
      Object.keys(condition).length > 0;

    if (hasCondition && !evaluateCondition(condition, mergedData)) {
      continue; // condition not met
    }

    // 4. Compute savings
    const baseSavings = evaluateFormula(trigger.savings_formula, mergedData);
    const floor = trigger.savings_floor != null ? Number(trigger.savings_floor) : 0;
    const ceiling =
      trigger.savings_ceiling != null ? Number(trigger.savings_ceiling) : Infinity;

    const clampedBase = Math.max(floor, Math.min(ceiling, baseSavings));
    const estimatedLow = Math.round(clampedBase * 0.6);
    const estimatedBase = Math.round(clampedBase);
    const estimatedHigh = Math.round(clampedBase * 1.5);

    // Compute confidence
    const requiredTotal = 1 + requiresAll.length;
    const requiredPresent =
      1 +
      requiresAll.filter((r) =>
        dataIndex.has(`${trigger.provider}::${r}`)
      ).length;
    const depth = hasCondition ? conditionDepth(condition) : 0;
    const confidence = computeConfidence(
      requiredPresent,
      requiredTotal,
      entry.fetchedAt,
      depth
    );

    // Build evidence
    const evidence: Record<string, unknown> = {
      provider: trigger.provider,
      dataType: trigger.data_type,
      dataProviders: Array.from(userProviders),
      conditionMet: true,
    };

    const reasoning =
      trigger.description ??
      `Identified via ${trigger.provider} ${trigger.data_type} data`;

    matches.push({
      strategyId: trigger.strategy_id,
      triggerId: trigger.id,
      estimatedLow,
      estimatedBase,
      estimatedHigh,
      confidence,
      evidence,
      reasoning,
    });
  }

  // 5. Upsert into user_strategy_matches (best match per strategy)
  const bestByStrategy = new Map<string, StrategyMatchResult>();
  for (const m of matches) {
    const existing = bestByStrategy.get(m.strategyId);
    if (!existing || m.estimatedBase > existing.estimatedBase) {
      bestByStrategy.set(m.strategyId, m);
    }
  }

  const upsertRows = Array.from(bestByStrategy.values()).map((m) => ({
    user_id: userId,
    strategy_id: m.strategyId,
    trigger_id: m.triggerId,
    estimated_low: m.estimatedLow,
    estimated_base: m.estimatedBase,
    estimated_high: m.estimatedHigh,
    confidence: m.confidence,
    evidence: m.evidence,
    reasoning: m.reasoning,
    status: "identified" as const,
  }));

  if (upsertRows.length > 0) {
    await admin
      .from("user_strategy_matches")
      .upsert(upsertRows, { onConflict: "user_id,strategy_id" });
  }

  return Array.from(bestByStrategy.values());
}
