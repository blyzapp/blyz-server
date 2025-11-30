// ============================================================================
// 💰 PayoutWeek Model — FINAL 2025 BUILD
// ============================================================================
// Stores weekly payout summaries + all operator breakdown data
// ============================================================================

import mongoose from "mongoose";
import PayoutOperatorSchema from "./PayoutOperator.mjs";

const PayoutWeekSchema = new mongoose.Schema(
  {
    // Unique key for the week — e.g. "2025-W12"
    weekKey: { type: String, required: true },

    // Label shown in admin panel — e.g. "March 17–23"
    label: { type: String, required: true },

    // ISO date strings for the start and end of the week
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },

    // Total payout amounts
    totalAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },

    // Job + operator counts
    jobsCount: { type: Number, default: 0 },
    operatorsCount: { type: Number, default: 0 },

    // Workflow status
    status: {
      type: String,
      enum: ["draft", "processing", "paid"],
      default: "draft",
    },

    // When this payout week was generated
    generatedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },

    // Breakdown array — embedded schema for each operator
    operatorBreakdown: {
      type: [PayoutOperatorSchema],
      default: [],
    },
  },

  { timestamps: true }
);

export default mongoose.model("PayoutWeek", PayoutWeekSchema);
