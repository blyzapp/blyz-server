// ============================================================================
// ❄️ Blyz Job Model — FINAL 2025 BUILD
// ============================================================================

import mongoose from "mongoose";

// ✅ FIXED IMPORT — Job.mjs and Operator.mjs are in the SAME folder
import Operator from "./Operator.mjs";

const JobSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
      default: null,
    },

    // ----------------------------
    // Job Details
    // ----------------------------
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    notes: { type: String },

    price: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "en_route",
        "started",
        "completed",
        "cancelled",
        "dispute",
      ],
      default: "pending",
    },

    // ----------------------------
    // Photo Uploads
    // ----------------------------
    beforePhotos: [{ type: String }],
    afterPhotos: [{ type: String }],

    // ----------------------------
    // Timeline Tracking
    // ----------------------------
    timeline: [
      {
        status: String,
        timestamp: Date,
      },
    ],
  },

  { timestamps: true }
);

// ============================================================================
// Ensure model is not re-compiled when server hot-reloads
// ============================================================================
const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

export default Job;
