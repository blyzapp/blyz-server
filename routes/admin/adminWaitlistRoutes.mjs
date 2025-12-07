// ============================================================================
// 📝 Admin Waitlist Routes — FINAL 2025 PRODUCTION BUILD (FIXED PATH)
// ============================================================================

import express from "express";
// ⭐ FIXED: correct path when inside /routes/admin/
import Waitlist from "../../models/Waitlist.mjs";

const router = express.Router();

// GET ALL WAITLIST ENTRIES
router.get("/", async (req, res) => {
  try {
    const entries = await Waitlist.find().sort({ createdAt: -1 });

    return res.json({
      ok: true,
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

// ADD NEW ENTRY
router.post("/", async (req, res) => {
  try {
    const { name, email, postalCode, source } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ ok: false, message: "Email is required." });
    }

    const created = await Waitlist.create({
      name,
      email,
      postalCode,
      source: source || "admin",
    });

    return res.json({ ok: true, data: created });
  } catch (err) {
    console.error("❌ Waitlist POST error:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to add waitlist entry.",
    });
  }
});

// DELETE ENTRY
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Waitlist.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res
        .status(404)
        .json({ ok: false, message: "Entry not found." });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Waitlist DELETE error:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to delete entry.",
    });
  }
});

export default router;

