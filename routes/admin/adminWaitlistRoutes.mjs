// ============================================================================
// 📝 Admin Waitlist Routes — FINAL 2025 SECURE BUILD
// - Protected by adminAuth middleware in server.mjs
// - Clean, consistent responses
// - Search + filtering + sorting
// ============================================================================

import express from "express";
import Waitlist from "../../models/Waitlist.mjs";

const router = express.Router();

// ============================================================================
// GET /api/admin/waitlist
// - Returns all waitlist entries
// - Supports search: ?q=ryan
// - Supports filters: ?source=public OR admin
// ============================================================================
router.get("/", async (req, res) => {
  try {
    const { q, source } = req.query;

    const query = {};

    // Search by name or email
    if (q) {
      query.$or = [
        { email: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by source (public/admin)
    if (source) {
      query.source = source;
    }

    const entries = await Waitlist.find(query)
      .sort({ joinedAt: -1 }) // IMPORTANT: Matches controller field
      .lean();

    return res.json({
      ok: true,
      total: entries.length,
      data: entries,
    });
  } catch (err) {
    console.error("❌ Waitlist GET error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error loading waitlist.",
    });
  }
});

// ============================================================================
// POST /api/admin/waitlist
// - Adds new waitlist entry manually
// - Prevents duplicates
// ============================================================================
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, postalCode, source } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        ok: false,
        message: "Valid email is required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Prevent duplicate admin entries
    const existing = await Waitlist.findOne({ email: cleanEmail });
    if (existing) {
      return res.json({
        ok: true,
        duplicate: true,
        message: "Email already exists in waitlist.",
        data: existing,
      });
    }

    const created = await Waitlist.create({
      name: name?.trim() || "",
      email: cleanEmail,
      phone: phone?.trim() || "",
      postalCode: postalCode?.trim() || "",
      source: source || "admin",
      joinedAt: new Date(),
    });

    return res.json({
      ok: true,
      message: "Waitlist entry added.",
      data: created,
    });
  } catch (err) {
    console.error("❌ Waitlist POST error:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to add waitlist entry.",
    });
  }
});

// ============================================================================
// DELETE /api/admin/waitlist/:id
// ============================================================================
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Waitlist.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({
        ok: false,
        message: "Entry not found.",
      });
    }

    return res.json({
      ok: true,
      message: "Entry deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Waitlist DELETE error:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to delete entry.",
    });
  }
});

export default router;
