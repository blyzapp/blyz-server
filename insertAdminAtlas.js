// ============================================================================
// 🌐 Insert Admin User into Atlas — One-Shot Script
// ============================================================================

import mongoose from "mongoose";

// -----------------------------
// Atlas connection (replace password if needed)
// -----------------------------
const MONGO_URI = "mongodb+srv://Blyzapp_Admin:Test1234@blyzapp.f1ttxsz.mongodb.net/blyz?retryWrites=true&w=majority";

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
    // Connect to Atlas
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to Atlas!");

    // Check if admin already exists
    const exists = await User.findOne({ email: "admin@blyzapp.com" });
    if (exists) {
      console.log("⚠️ Admin user already exists, skipping insertion.");
    } else {
      // Insert admin user
      await User.create({
        email: "admin@blyzapp.com",
        password: "$2a$10$KqXNc.Z/xV1n9jT0ffzKnOKrFhFtUQkFpRCANhAbP8Q8aFV42whXi", // hashed: blyzadmin123
        role: "admin",
        name: "Blyz Admin"
      });
      console.log("🎉 Admin user inserted successfully!");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
  }
}

run();
