import mongoose from "mongoose";

const operatorWaitlistSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    vehicle: { type: String, trim: true },
    source: { type: String, default: "operator" },
    joinedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default mongoose.model("OperatorWaitlist", operatorWaitlistSchema);
