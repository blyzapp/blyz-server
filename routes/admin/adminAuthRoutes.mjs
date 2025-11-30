// ============================================================================
// 🔐 Admin Authentication Routes — Blyz Server (2025 FINAL BUILD)
// ============================================================================
// Provides:
// - POST /api/admin/auth/login → Admin login + JWT return
// - Dev-mode auto login using MOCK_ADMIN_EMAIL
// ============================================================================

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

import User from "../../models/User.mjs";

const router = express.Router();

// ============================================================================
// POST /api/admin/auth/login
// ============================================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ------------------------------------------------------------------------
    // 1. DEV MODE AUTO LOGIN (no password)
    // ------------------------------------------------------------------------
    if (
      process.env.NODE_ENV === "development" &&
      process.env.MOCK_ADMIN_EMAIL &&
      email === process.env.MOCK_ADMIN_EMAIL
    ) {
      console.log("⚠️ DEV ADMIN LOGIN USING MOCK_ADMIN_EMAIL");

      const token = jwt.sign(
        {
          id: "dev-admin-id",
          email,
          role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        ok: true,
        token,
        admin: { email, role: "admin" },
      });
    }

    // ------------------------------------------------------------------------
    // 2. Check if admin exists in DB
    // ------------------------------------------------------------------------
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({
        ok: false,
        message: "Admin account not found",
      });
    }

    // ------------------------------------------------------------------------
    // 3. Validate password
    // ------------------------------------------------------------------------
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({
        ok: false,
        message: "Invalid password",
      });
    }

    // ------------------------------------------------------------------------
    // 4. Create JWT
    // ------------------------------------------------------------------------
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error during admin login",
    });
  }
});

export default router;
