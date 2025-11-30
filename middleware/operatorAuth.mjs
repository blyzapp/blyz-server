// ============================================================================
// 🔐 operatorAuth Middleware — FINAL 2025 BUILD
// ============================================================================
// - Ensures ONLY operators can access operator routes
// - Works with JWT (req.role === "operator")
// - Protects all /api/operator/... endpoints
// ============================================================================

import jwt from "jsonwebtoken";

export default function operatorAuth(req, res, next) {
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

    if (!decoded || decoded.role !== "operator") {
      return res.status(403).json({
        ok: false,
        message: "Operator access only"
      });
    }

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    console.error("❌ OperatorAuth Error:", err);
    res.status(401).json({
      ok: false,
      message: "Invalid or expired operator token"
    });
  }
}
