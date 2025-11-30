// ============================================================================
// 🔐 Auth Middleware — FINAL 2025 BUILD
// ============================================================================
// - Protects customer & operator routes
// - Decodes JWT and attaches req.userId + req.role
// ============================================================================

import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      ok: false,
      message: "Missing or invalid authorization header"
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    console.error("❌ JWT Error:", err);
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token"
    });
  }
}
