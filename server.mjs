// ============================================================================
// 🌐 Blyz Server — FINAL DEV/PROD BUILD
// ============================================================================
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import http from "http";
import { initWebSocketServer } from "./websocket/index.mjs";

// Routes
import authRouter from "./routes/authRoutes.mjs";
import jobsRouter from "./routes/jobs.mjs";
import waitlistRoute from "./routes/public/waitlistRoute.mjs";

import operatorJobsRouter from "./routes/operator/operatorJobsRoute.mjs";
import operatorMyJobsRouter from "./routes/operator/operatorMyJobsRoute.mjs";
import operatorJobDetailRouter from "./routes/operator/operatorJobDetailRoute.mjs";
import operatorJobStartRouter from "./routes/operator/operatorJobStartRoute.mjs";
import operatorJobCompleteRouter from "./routes/operator/operatorJobCompleteRoute.mjs";
import operatorPhotosRouter from "./routes/operator/operatorPhotosRoute.mjs";

// Admin
import adminJobRoutes from "./routes/admin/adminJobRoutes.mjs";
import adminPayoutRoutes from "./routes/admin/adminPayoutRoutes.mjs";
import adminOperatorRoutes from "./routes/admin/adminOperatorRoutes.mjs";
import adminDashboardRoutes from "./routes/admin/adminDashboardRoutes.mjs";
import adminAuthRoutes from "./routes/admin/adminAuthRoutes.mjs";
import adminAnalyticsRoutes from "./routes/admin/analyticsRoutes.mjs";

// ⭐ FIXED — Correct file name + path
import adminWaitlistRoutes from "./routes/admin/adminWaitlistRoutes.mjs";

// Middleware
import requireAdmin from "./middleware/adminAuth.mjs";

// -----------------------------------------------------------------------------
// MongoDB
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Express App
// -----------------------------------------------------------------------------
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://blyzapp.com",
      "https://www.blyzapp.com",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// -----------------------------------------------------------------------------
// Health check
// -----------------------------------------------------------------------------
app.get("/", (req, res) =>
  res.status(200).json({ ok: true, message: "Blyz API is running" })
);

// -----------------------------------------------------------------------------
// Public Routes
// -----------------------------------------------------------------------------
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/waitlist", waitlistRoute);

// -----------------------------------------------------------------------------
// Operator Routes
// -----------------------------------------------------------------------------
app.use("/api/operator/jobs", operatorJobsRouter);
app.use("/api/operator/my", operatorMyJobsRouter);
app.use("/api/operator/job", operatorJobDetailRouter);
app.use("/api/operator/job/start", operatorJobStartRouter);
app.use("/api/operator/job/complete", operatorJobCompleteRouter);
app.use("/api/operator/photos", operatorPhotosRouter);

// -----------------------------------------------------------------------------
// Admin Routes
// -----------------------------------------------------------------------------
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/payouts", adminPayoutRoutes);
app.use("/api/admin/operators", adminOperatorRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/analytics", requireAdmin, adminAnalyticsRoutes);

// ⭐ FIX: Now loads correct waitlist file
app.use("/api/admin/waitlist", requireAdmin, adminWaitlistRoutes);

// -----------------------------------------------------------------------------
// Server + WebSockets
// -----------------------------------------------------------------------------
const server = http.createServer(app);
initWebSocketServer(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Blyz Server running on http://localhost:${PORT}`);
  console.log("=========================================");
  console.log("🛰️ WebSocket Live Tracking Enabled");
});

