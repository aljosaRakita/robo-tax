// ============================================================
// RoboTax V1 — Shared Type Definitions
// ============================================================

// ---- Auth ----

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface RegisterPayload {
  email: string;
  phone: string;
  password: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyPayload {
  type: "email" | "phone";
  code: string;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, "emailVerified" | "phoneVerified"> & {
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  error?: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// ---- Power Ups ----

export type PowerUpCategory =
  | "financial"
  | "accounting"
  | "payroll"
  | "r-and-d"
  | "property"
  | "documents";

export type IntegrationStatus =
  | "pending"
  | "connected"
  | "syncing"
  | "synced"
  | "error";

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  category: PowerUpCategory;
  logoUrl: string;
  /** Whether user has connected this source */
  connected: boolean;
  /** Weight multiplier for savings calculation (1-5) */
  savingsWeight: number;
  /** Whether this is a native/built-in feature (no external provider) */
  isNative?: boolean;
  /** The backing integration provider (e.g. "plaid") */
  provider?: string | null;
  /** Current integration sync status */
  integrationStatus?: IntegrationStatus;
  /** ISO timestamp of last successful data sync */
  lastSyncedAt?: string | null;
}

export interface CategoryInfo {
  id: PowerUpCategory;
  label: string;
  icon: string; // lucide icon name
  description: string;
}

export interface ConnectPayload {
  powerUpId: string;
  action: "connect" | "disconnect";
}

export interface PowerUpsResponse {
  powerUps: PowerUp[];
  categories: CategoryInfo[];
  stats: {
    total: number;
    connected: number;
    percentage: number;
  };
}

// ---- Strategy Matches ----

export interface StrategyMatch {
  strategyId: string;
  strategyTitle: string;
  estimatedLow: number;
  estimatedBase: number;
  estimatedHigh: number;
  confidence: number;
  reasoning: string;
  evidence: Record<string, unknown>;
  status: "identified" | "verified" | "claimed" | "dismissed";
}

// ---- Savings ----

export interface SavingsEstimate {
  conservative: number;
  base: number;
  aggressive: number;
  confidence: number; // 0-100
  connectedSources: number;
  totalSources: number;
  percentage: number;
  topStrategies: string[];
  /** Per-strategy data-driven matches (present when integration data exists) */
  strategyMatches?: StrategyMatch[];
}

export interface SavingsResponse {
  success: boolean;
  lowConfidence: boolean;
  estimate?: SavingsEstimate;
  warning?: string;
}
