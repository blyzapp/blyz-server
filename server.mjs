// ============================================================================
// 🌐 Blyz Server — FINAL DEV/PROD BUILD (WITH OPERATOR WAITLIST)
// ============================================================================

import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import http from "http";

import { initWebSocketServer } from "./websocket/index.mjs";

// ============================================================================
// 📦 ROUTE IMPORTS
// ============================================================================

// --- Public ---
import authRouter from "./routes/authRoutes.mjs";
import jobsRouter from "./routes/jobs.mjs";
import waitlistRoute from "./routes/public/waitlistRoute.mjs";              // Customer waitlist
import operatorWaitlistRoute from "./routes/public/operatorWaitlistRoute.mjs"; // ⭐ NEW operator waitlist

// --- Operator App ---
import operatorJobsRouter from "./routes/operator/operatorJobsRoute.mjs";
import operatorMyJobsRouter from "./routes/operator/operatorMyJobsRoute.mjs";
import operatorJobDetailRouter from "./routes/operator/operatorJobDetailRoute.mjs";
import operatorJobStartRouter from "./routes/operator/operatorJobStartRoute.mjs";
import operatorJobCompleteRouter from "./routes/operator/operatorJobCompleteRoute.mjs";
import operatorPhotosRouter from "./routes/operator/operatorPhotosRoute.mjs";

// --- Admin Panel ---
import adminJobRoutes from "./routes/admin/adminJobRoutes.mjs";
import adminPayoutRoutes from "./routes/admin/adminPayoutRoutes.mjs";
import adminOperatorRoutes from "./routes/admin/adminOperatorRoutes.mjs";
import adminDashboardRoutes from "./routes/admin/adminDashboardRoutes.mjs";
import adminAuthRoutes from "./routes/admin/adminAuthRoutes.mjs";
import adminAnalyticsRoutes from "./routes/admin/analyticsRoutes.mjs";
import adminWaitlistRoutes from "./routes/admin/adminWaitlistRoutes.mjs";

// Middleware
import requireAdmin from "./middleware/adminAuth.mjs";

// ============================================================================
// 🍃 CONNECT TO MONGODB
// ============================================================================
async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "blyz",
      serverSelectionTimeoutMS: 5000,
    });
    console.log("🍃 MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}
connectMongo();

// ============================================================================
// 🚀 INIT EXPRESS APP
// ============================================================================
const app = express();

// ============================================================================
// 🌐 CORS CONFIG
// ============================================================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://blyzapp.com",
      "https://www.blyzapp.com",
      "https://blyz-landing-static-git-main-blyzapps-projects.vercel.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// ============================================================================
// 📦 MIDDLEWARE
// ============================================================================
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ============================================================================
// ❤️ HEALTH CHECK
// ============================================================================
app.get("/", (req, res) =>
  res.status(200).json({ ok: true, message: "Blyz API is running" })
);

// ============================================================================
// 🌐 PUBLIC ROUTES
// ============================================================================
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/waitlist", waitlistRoute);              // Customer waitlist
app.use("/api/waitlist/operator", operatorWaitlistRoute); // ⭐ NEW operator waitlist

// ============================================================================
// 🛠️ OPERATOR APP ROUTES
// ============================================================================
app.use("/api/operator/jobs", operatorJobsRouter);
app.use("/api/operator/my", operatorMyJobsRouter);
app.use("/api/operator/job", operatorJobDetailRouter);
app.use("/api/operator/job/start", operatorJobStartRouter);
app.use("/api/operator/job/complete", operatorJobCompleteRouter);
app.use("/api/operator/photos", operatorPhotosRouter);

// ============================================================================
// 🔐 ADMIN ROUTES (some protected by requireAdmin)
// ============================================================================
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/payouts", adminPayoutRoutes);
app.use("/api/admin/operators", adminOperatorRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Protected admin routes
app.use("/api/admin/analytics", requireAdmin, adminAnalyticsRoutes);
app.use("/api/admin/waitlist", requireAdmin, adminWaitlistRoutes);

// ============================================================================
// 🚀 SERVER + WEBSOCKETS
// ============================================================================
const server = http.createServer(app);
initWebSocketServer(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Blyz Server running on http://localhost:${PORT}`);
  console.log("=========================================");
  console.log("🛰️ WebSocket Live Tracking Enabled");
});
