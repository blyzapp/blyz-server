
// ============================================================================
// 🌐 Reset or Create Admin User — One-Shot Script
// ============================================================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.mjs"; // adjust path if needed
import "dotenv/config";

async function resetAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "blyz",
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB");

    // Hash the admin password
    const hashedPassword = await bcrypt.hash("blyzadmin123", 10);

    // Update existing admin or create new
    const admin = await User.findOneAndUpdate(
      { email: "admin@blyzapp.com" },
      { password: hashedPassword, role: "admin", name: "Blyz Admin" },
      { new: true, upsert: true } // creates if missing
    );

    console.log("🎉 Admin user reset successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR resetting admin:", err.message);
    process.exit(1);
  }
}

resetAdminPassword();
