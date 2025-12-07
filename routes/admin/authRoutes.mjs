// ============================================================================
// 🔐 Admin Authentication Routes — FINAL 2025 R4 BUILD
// - Supports real JWT login
// - Supports DEV bypass mode (no password needed)
// - Provides /login and /me
// - Works perfectly with AdminAuthContext in Next.js
// ============================================================================

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../../models/Admin.mjs";
import requireAdmin from "../../middleware/adminAuth.mjs";

const router = express.Router();

// Load ENV
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";
const DEV_ADMIN_MODE = process.env.DEV_ADMIN_MODE === "true"; 
// (or handled by NEXT_PUBLIC_DEV_ADMIN on frontend)

// ============================================================================
// 🟦 ADMIN LOGIN
// POST /api/admin/auth/login
// ============================================================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ---------------------------------------------------------
    // ⭐ DEV MODE (no DB required)
    // ---------------------------------------------------------
    if (DEV_ADMIN_MODE) {
      console.log("⚠️ DEV MODE: Returning mock admin token");

      const token = jwt.sign(
        {
          role: "admin",
          name: "DEV Admin",
          email: "dev@blyzapp.com",
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        ok: true,
        message: "DEV MODE login successful",
        admin: {
          name: "DEV Admin",
          email: "dev@blyzapp.com",
          role: "admin",
        },
        token,
      });
    }

    // ---------------------------------------------------------
    // 🟩 PRODUCTION LOGIN
    // ---------------------------------------------------------
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        ok: false,
        message: "Admin not found",
      });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(400).json({
        ok: false,
        message: "Invalid password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
        name: admin.name,
        email: admin.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      admin: {
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
      token,
    });
  } catch (err) {
    console.error("❌ Admin Login Error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error during login",
    });
  }
});

// ============================================================================
// 🟦 GET AUTHENTICATED ADMIN
// GET /api/admin/auth/me
// Protected ✔
// ============================================================================
router.get("/me", requireAdmin, async (req, res) => {
  try {
    // req.admin is injected from middleware
    return res.json({
      ok: true,
      admin: req.admin,
    });
  } catch (err) {
    console.error("❌ Admin /me error:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to load admin details",
    });
  }
});

export default router;
