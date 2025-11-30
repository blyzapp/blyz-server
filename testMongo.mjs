import mongoose from "mongoose";
import "dotenv/config";

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "blyzdb" });
    console.log("✅ MongoDB Connected Successfully!");
    const db = mongoose.connection;
    console.log("DB Name:", db.name);
    console.log("Collections:", await db.db.listCollections().toArray());
    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
  }
}

testConnection();
