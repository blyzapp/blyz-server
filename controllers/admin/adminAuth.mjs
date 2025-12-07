// ============================================================================
// 🔐 Admin Login Controller — FINAL 2025 BUILD
// ============================================================================
// Handles admin login and returns a JWT with isAdmin: true
// ============================================================================

import jwt from "jsonwebtoken";

// Hard-coded admin for MVP testing
// Replace with database lookup when ready
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@blyzapp.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "blyzadmin123";

export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        ok: false,
        message: "Invalid admin credentials",
      });
    }

    // Create the admin token
    const token = jwt.sign(
      {
        id: "blyz-admin-id",
        isAdmin: true, // REQUIRED for middleware
      },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
    });
  } catch (err) {
    console.error("❌ Admin Login Error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error during admin login",
    });
  }
}
