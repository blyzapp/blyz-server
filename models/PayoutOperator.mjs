// ============================================================================
// 💰 PayoutOperator Schema — FINAL 2025 BUILD
// ============================================================================
// Embedded operator breakdown inside PayoutWeek
// ============================================================================

import mongoose from "mongoose";

const PayoutOperatorSchema = new mongoose.Schema(
  {
    operatorId: { type: String, required: true },
    operatorName: { type: String, required: true },
    jobsCount: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "processing", "paid"],
      default: "draft",
    },
  },
  { timestamps: true }
);

// ============================================================================
// ❗ IMPORTANT: Export ONLY the SCHEMA, NOT a model
// This allows it to be embedded inside PayoutWeek.operatorBreakdown
// ============================================================================
export default PayoutOperatorSchema;
