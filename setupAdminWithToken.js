// ============================================================================
// 🌐 Setup Admin User + Generate JWT — One-Shot Script for Blyz
// ============================================================================

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

// -----------------------------
// ⚠️ Replace with your Atlas DB credentials
// -----------------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Blyzapp_Admin:Test1234@blyzapp.f1ttxsz.mongodb.net/blyz?retryWrites=true&w=majority";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "supersecretkey";

// -----------------------------
// User schema
// -----------------------------
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to Atlas!");

    // -----------------------------
    // Check if admin already exists
    // -----------------------------
    let admin = await User.findOne({ email: "admin@blyzapp.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("blyzadmin123", 10);
      admin = await User.create({
        email: "admin@blyzapp.com",
        password: hashedPassword,
        role: "admin",
        name: "Blyz Admin"
      });
      console.log("🎉 Admin user inserted successfully!");
    } else {
      console.log("⚠️ Admin user already exists, skipping insertion.");
    }

    // -----------------------------
    // Generate JWT token
    // -----------------------------
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        isAdmin: true
      },
      ADMIN_JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🔑 Admin JWT token:");
    console.log(token);

    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  }
}

run();
