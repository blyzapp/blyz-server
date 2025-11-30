// ============================================================================
// 👑 Admin User Creator — One-Time Script
// Creates a full admin account in MongoDB for the Blyz Admin Panel
// ============================================================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

import User from "./models/User.mjs";

async function run() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "blyz",
    });

    console.log("🔐 Creating Admin User...");

    const email = "admin@blyz.com";
    const password = "Admin123!"; // You can change this

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Super Admin",
      email,
      password: hashed,
      role: "admin",
    });

    console.log("✅ Admin user created successfully:");
    console.log({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    console.log("\n📌 LOGIN CREDENTIALS:");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
}

run();
