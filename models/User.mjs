// ============================================================================
// 👤 User Model — FINAL 2025 BUILD
// ============================================================================
// Supports:
// - Customer accounts
// - Operator accounts
// - Admin accounts
// - Operator rating + job stats
// - Operator GPS tracking (lat/lng)
// - Future: operator documents, insurance, vehicle info
// ============================================================================

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // -------------------------------------------------------
    // BASIC ACCOUNT FIELDS
    // -------------------------------------------------------
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // -------------------------------------------------------
    // ROLE: customer | operator | admin
    // -------------------------------------------------------
    role: { type: String, required: true, default: "customer" },

    // -------------------------------------------------------
    // OPERATOR FIELDS
    // -------------------------------------------------------
    rating: { type: Number, default: 0 },
    jobsCompleted: { type: Number, default: 0 },
    status: {
      type: String,
      default: "offline", // online / offline / pending_approval / busy
    },

    phone: { type: String },
    photoUrl: { type: String },
    vehicle: { type: String },

    // -------------------------------------------------------
    // GPS TRACKING
    // -------------------------------------------------------
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    lastLocationAt: { type: Date, default: null },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Export the User model
export default mongoose.model("User", UserSchema);
