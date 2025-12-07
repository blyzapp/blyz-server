// ============================================================================
// 🌐 Admin Setup + Login + Analytics Test — One-Shot Script
// ============================================================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import "dotenv/config";

// -----------------------------
// Config
// -----------------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Blyzapp_Admin:Test1234@blyzapp.f1ttxsz.mongodb.net/blyz?retryWrites=true&w=majority";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "supersecretkey";
const SERVER_URL = "http://localhost:5000";

// -----------------------------
// User schema
// -----------------------------
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  name: String
});

const User = mongoose.model("User", UserSchema);

async function run() {
  try {
    // 1️⃣ Connect to Atlas
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to Atlas!");

    // 2️⃣ Check if admin exists
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

    // 3️⃣ Generate JWT token for admin
    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      ADMIN_JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("🔑 Admin JWT token:");
    console.log(token);

    // 4️⃣ Test analytics endpoint
    const analyticsRes = await fetch(`${SERVER_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const analyticsData = await analyticsRes.json();

    console.log("📊 Analytics Response:");
    console.log(JSON.stringify(analyticsData, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  }
}

run();
