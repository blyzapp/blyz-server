// ============================================================================
// 👤 Operator Model — Blyz Server
// ============================================================================
import mongoose from "mongoose";

const OperatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    status: { type: String, default: "offline" }, // online / offline / busy
    rating: { type: Number, default: 0 },
    lat: { type: Number, default: 43.6532 },
    lng: { type: Number, default: -79.3832 },
    jobsCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Operator", OperatorSchema);
