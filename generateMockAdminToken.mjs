// ============================================================================
// 🔑 Generate Mock Admin Token — Blyz Server
// ============================================================================

import "dotenv/config";
import jwt from "jsonwebtoken";

// ------------------------------
// Validate environment
// ------------------------------
const { ADMIN_JWT_SECRET, NODE_ENV } = process.env;

if (!ADMIN_JWT_SECRET) {
  console.error("❌ ADMIN_JWT_SECRET missing in .env");
  process.exit(1);
}

if (NODE_ENV !== "development") {
  console.warn("⚠️ NODE_ENV is not 'development'. Using mock token is only recommended in dev.");
}

// ------------------------------
// Payload for dev admin
// ------------------------------
const payload = {
  id: "admin-001",
  email: "admin@blyz.com",
  role: "admin",
  name: "Partner B Admin",
};

// ------------------------------
// Sign token
// ------------------------------
const token = jwt.sign(payload, ADMIN_JWT_SECRET, {
  expiresIn: "7d", // token valid 7 days
});

console.log("✅ MOCK_ADMIN_TOKEN generated:\n");
console.log(token);
console.log("\n⚡ Copy this token into your .env as MOCK_ADMIN_TOKEN");
