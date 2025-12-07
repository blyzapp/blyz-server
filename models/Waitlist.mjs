// ============================================================================
// 📬 Waitlist Model — FINAL 2025 BUILD
// - Supports landing page + admin panel entries
// - Fields: email, name (optional), postalCode, source
// ============================================================================

import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
    },

    postalCode: { type: String },
    source: { type: String, default: "admin" }, // landing-page / admin
  },
  { timestamps: true }
);

export default mongoose.model("Waitlist", waitlistSchema);
