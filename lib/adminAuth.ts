// lib/adminAuth.ts
// ---------------------------------------------------------------------------
// Utility functions for managing admin auth token in localStorage
// ---------------------------------------------------------------------------

const ADMIN_TOKEN_KEY = "blyz_admin_token";

/**
 * Get the admin token from localStorage.
 * Returns null if not found or in SSR.
 * Falls back to NEXT_PUBLIC_MOCK_ADMIN_TOKEN in development.
 */
export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;

  let token = localStorage.getItem(ADMIN_TOKEN_KEY);

  // DEV fallback
  if (!token && process.env.NEXT_PUBLIC_MOCK_ADMIN_TOKEN) {
    console.log("⚠️ DEV MODE: Using NEXT_PUBLIC_MOCK_ADMIN_TOKEN");
    token = process.env.NEXT_PUBLIC_MOCK_ADMIN_TOKEN;
  }

  console.log("🔑 Admin token retrieved:", token);
  return token;
}

/**
 * Save the admin token in localStorage.
 */
export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  console.log("✅ Admin token saved:", token);
}

/**
 * Remove the admin token from localStorage.
 */
export function clearAdminToken() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ADMIN_TOKEN_KEY);
  console.log("❌ Admin token cleared");
}
