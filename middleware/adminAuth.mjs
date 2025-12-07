// ============================================================================
// 🔐 Admin Auth Middleware — FINAL 2025 R7 BUILD
// - FIXED: Supports tokens using isAdmin (your current tokens)
// - FIXED: Allows role="admin" OR isAdmin=true
// - DEV mock bypass correct
// - No more false 403s
// ============================================================================

import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        ok: false,
        message: "Missing authorization header",
      });
    }

    const token = header.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Invalid token format",
      });
    }

    // ================================================================
    // ⭐ DEV MODE BYPASS
    // ================================================================
    const DEV_ENABLED =
      process.env.NODE_ENV === "development" ||
      process.env.DEV_ADMIN === "true";

    const SERVER_MOCK = process.env.MOCK_ADMIN_TOKEN;

    if (DEV_ENABLED && SERVER_MOCK && token === SERVER_MOCK) {
      console.warn("⚠️ DEV MODE: Admin bypass active");

      req.admin = {
        id: "dev-admin-id",
        name: "Development Admin",
        email: "dev@blyzapp.com",
        role: "admin",
      };

      req.isAdmin = true;
      return next();
    }

    // ================================================================
    // 🟩 VERIFY REAL ADMIN JWT
    // ================================================================
    const JWT_SECRET =
      process.env.ADMIN_JWT_SECRET ||
      process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("❌ Missing ADMIN_JWT_SECRET");
      return res.status(500).json({
        ok: false,
        message: "Server misconfiguration",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // ⭐ FIXED ADMIN CHECK ⭐
    const isAdmin =
      decoded?.isAdmin === true ||
      decoded?.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "Unauthorized — admin access required",
      });
    }

    req.admin = {
      id: decoded.id || decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || "admin",
      isAdmin: true,
    };

    req.isAdmin = true;

    return next();
  } catch (err) {
    console.error("❌ Admin Middleware Error:", err.message);

    return res.status(401).json({
      ok: false,
      message: "Invalid admin token",
    });
  }
}

