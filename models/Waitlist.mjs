// ============================================================================
// 📬 Waitlist Model — FINAL 2025 BUILD (SYNCED WITH ALL CONTROLLERS)
// - Supports Landing Page + Admin Panel
// - Fields: email, name, phone, postalCode, source, joinedAt
// - Includes unique email index + timestamps
// ============================================================================

import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    postalCode: {
      type: String,
      trim: true,
      default: "",
    },

    // "public" = landing page signup
    // "admin"  = manually added from admin panel
    source: {
      type: String,
      default: "public",
    },

    // Required for sorting in admin panel
    joinedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

// Enforce uniqueness at DB level
waitlistSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("Waitlist", waitlistSchema);
