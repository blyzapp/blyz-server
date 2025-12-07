// ============================================================================
// 🌐 Admin Waitlist Controller — FINAL 2025 BUILD
// ============================================================================

import mongoose from "mongoose";
import Waitlist from "../../models/Waitlist.mjs";

// ============================================================================
// 📌 GET — Fetch all waitlist entries
// ============================================================================
export const getWaitlist = async (req, res) => {
  try {
    const entries = await Waitlist.find()
      .sort({ joinedAt: -1 })
      .lean();

    return res.json({ ok: true, data: entries });
  } catch (err) {
    console.error("❌ Error fetching waitlist:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Unable to fetch waitlist" });
  }
};

// ============================================================================
// ➕ POST — Add a new waitlist entry
// ============================================================================
export const addWaitlistEntry = async (req, res) => {
  try {
    let { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        ok: false,
        message: "Name and email are required",
      });
    }

    // Normalize email to avoid duplicates
    email = email.toLowerCase().trim();

    // Prevent duplicates
    const exists = await Waitlist.findOne({ email });
    if (exists) {
      return res.status(400).json({
        ok: false,
        message: "This email is already on the waitlist",
      });
    }

    const newEntry = await Waitlist.create({
      name: name.trim(),
      email,
      joinedAt: new Date(),
    });

    return res.json({ ok: true, data: newEntry });
  } catch (err) {
    console.error("❌ Error adding waitlist entry:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Unable to add waitlist entry" });
  }
};

// ============================================================================
// ❌ DELETE — Remove a waitlist entry by ID
// ============================================================================
export const deleteWaitlistEntry = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent Mongoose crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid waitlist ID",
      });
    }

    const deleted = await Waitlist.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        ok: false,
        message: "Waitlist entry not found",
      });
    }

    return res.json({
      ok: true,
      message: "Waitlist entry deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting waitlist entry:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Unable to delete waitlist entry" });
  }
};

