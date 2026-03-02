import type { User } from "@/lib/types";

export interface StoredUser extends User {
  password: string;
}

/**
 * In-memory user store. Seed with one demo user.
 * In V1 this becomes Supabase Auth.
 */
export const users: StoredUser[] = [
  {
    id: "user_demo_001",
    email: "demo@robotax.com",
    phone: "+15551234567",
    password: "demo1234",
    name: "Demo User",
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
  },
];

/** Track which power-up IDs each user has connected (userId → Set<powerUpId>) */
export const userConnections = new Map<string, Set<string>>([
  ["user_demo_001", new Set<string>()],
]);

/** Pending verification codes: `${userId}:${type}` → code */
export const verificationCodes = new Map<string, string>();

// ---- Helpers ----

let userIdCounter = 1;

export function createUser(data: {
  email: string;
  phone: string;
  password: string;
  name: string;
}): StoredUser {
  const user: StoredUser = {
    id: `user_${Date.now()}_${++userIdCounter}`,
    email: data.email,
    phone: data.phone,
    password: data.password,
    name: data.name,
    emailVerified: false,
    phoneVerified: false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  userConnections.set(user.id, new Set());
  return user;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): StoredUser | undefined {
  return users.find((u) => u.id === id);
}

export function generateVerificationCode(userId: string, type: "email" | "phone"): string {
  const code = "123456"; // Always 123456 for V0 prototype
  verificationCodes.set(`${userId}:${type}`, code);
  return code;
}

export function checkVerificationCode(
  userId: string,
  type: "email" | "phone",
  code: string
): boolean {
  const key = `${userId}:${type}`;
  const stored = verificationCodes.get(key);
  if (stored === code) {
    verificationCodes.delete(key);
    return true;
  }
  return false;
}
