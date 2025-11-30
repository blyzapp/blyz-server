// ============================================================================
// 🔐 Admin Auth Middleware — FINAL 2025 BUILD
// ============================================================================
// Validates the Admin JWT and attaches adminId to req
// Supports MOCK token in development and test environments
// ============================================================================

import jwt from "jsonwebtoken";

export default function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization;

    // -------------------------
    // Check if authorization header exists
    // -------------------------
    if (!header) {
      return res.status(401).json({
        ok: false,
        message: "Missing authorization header",
      });
    }

    // -------------------------
    // Extract token
    // -------------------------
    const token = header.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Invalid token format",
      });
    }

    // ---------------------------------------------------
    // DEVELOPMENT / TEST MODE — Accept MOCK token
    // ---------------------------------------------------
    if (
      (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") &&
      token === process.env.NEXT_PUBLIC_MOCK_ADMIN_TOKEN
    ) {
      req.adminId = "dev-admin-id"; // attach mock admin ID
      return next();
    }

    // ---------------------------------------------------
    // PRODUCTION — Validate JWT
    // ---------------------------------------------------
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    if (!decoded || !decoded.isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "Unauthorized — admin access required",
      });
    }

    // Attach adminId to request
    req.adminId = decoded.id;
    next();
  } catch (err) {
    console.error("❌ AdminAuth error:", err);
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired admin token",
    });
  }
}
