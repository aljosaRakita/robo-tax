import type { SavingsEstimate } from "@/lib/types";
import type { PowerUp } from "@/lib/types";

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

/**
 * Calculates mock savings estimate based on which power-ups are connected.
 *
 * Logic:
 *  - Base: $5,000 minimum
 *  - Each connected source adds $3,000–$8,000 × its savingsWeight
 *  - Confidence scales linearly with connected percentage
 *  - Returns conservative / base / aggressive ranges
 */
export function calculateSavings(
  allPowerUps: PowerUp[],
  connectedIds: Set<string>
): SavingsEstimate {
  const connected = allPowerUps.filter((p) => connectedIds.has(p.id));
  const total = allPowerUps.length;
  const connectedCount = connected.length;
  const percentage = total > 0 ? Math.round((connectedCount / total) * 100) : 0;

  // Sum weighted contribution
  const weightedSum = connected.reduce((sum, p) => {
    const contribution = (3000 + Math.random() * 5000) * p.savingsWeight;
    return sum + contribution;
  }, 0);

  const baseSavings = Math.round(5000 + weightedSum);
  const confidence = Math.min(100, Math.round(percentage * 1.2));

  // Pick top strategies proportional to connected count
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
