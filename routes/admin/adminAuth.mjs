// ============================================================================
// 🔐 Blyz Admin Auth Middleware — FINAL 2025 (DEV MODE + PROD MODE SAFE)
// - DEV MODE: allows "dev-admin-token"
// - PROD MODE: requires real JWT
// - Role-based admin verification
// ============================================================================

import jwt from "jsonwebtoken";
import "dotenv/config";

export default function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();

  const devMode = process.env.DEV_ADMIN === "true";
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET;

  if (!JWT_SECRET) {
    console.error("❌ ERROR: ADMIN_JWT_SECRET missing in .env");
    return res.status(500).json({
      ok: false,
      message: "Server misconfiguration (missing ADMIN_JWT_SECRET)",
    });
  }

  console.log("🔍 Token received by middleware:", token);

  // ==========================================================================
  // 1️⃣ DEV MODE — Allow mock bypass with token "dev-admin-token"
  // ==========================================================================
  if (devMode) {
    if (token === "dev-admin-token") {
      console.log("⚠️ DEV MODE: Admin bypass active");
      req.admin = { id: "dev-admin", role: "admin" };
      return next();
    }
  }

  // ==========================================================================
  // 2️⃣ No token at all
  // ==========================================================================
  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "No admin token provided",
    });
  }

  // ==========================================================================
  // 3️⃣ Verify real JWT (production mode)
  // ==========================================================================
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({
        ok: false,
        message: "Admins only",
      });
    }

    req.adminId = decoded.id;
    req.admin = decoded;

    return next();
  } catch (err) {
    console.error("❌ Admin auth error:", err.message);
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired admin token",
    });
  }
}

