// ============================================================================
// 🌐 Blyz Server — FINAL 2025 BUILD (FULL WEBSOCKET INTEGRATION)
// Operator App + Customer App + Admin Panel + Live Tracking
// ============================================================================

import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import http from "http";

// ⭐ WEBSOCKETS
import { initWebSocketServer } from "./websocket/index.mjs";

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
// 📦 ROUTE IMPORTS
// ============================================================================

// --- Public ---
import authRouter from "./routes/authRoutes.mjs";
import jobsRouter from "./routes/jobs.mjs";

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

// ⭐ Admin login
import adminAuthRoutes from "./routes/admin/adminAuthRoutes.mjs";

// ============================================================================
// 🚀 INIT EXPRESS
// ============================================================================
const app = express();

// ============================================================================
// 🛡️ CORS CONFIG — REQUIRED FOR ADMIN PANEL
// ============================================================================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ============================================================================
// ❤️ HEALTH CHECK
// ============================================================================
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Blyz API is running",
  });
});

// ============================================================================
// 🚦 ROUTES
// ============================================================================

// --- Public ---
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);

// --- Operator ---
app.use("/api/operator/jobs", operatorJobsRouter);
app.use("/api/operator/my", operatorMyJobsRouter);
app.use("/api/operator/job", operatorJobDetailRouter);
app.use("/api/operator/job/start", operatorJobStartRouter);
app.use("/api/operator/job/complete", operatorJobCompleteRouter);
app.use("/api/operator/photos", operatorPhotosRouter);

// --- Admin Login ---
app.use("/api/admin/auth", adminAuthRoutes);

// --- Admin Main ---
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/payouts", adminPayoutRoutes);
app.use("/api/admin/operators", adminOperatorRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// ============================================================================
// 🛰️ SERVER + WEBSOCKETS
// ============================================================================
const server = http.createServer(app);
initWebSocketServer(server);

// ============================================================================
// ▶️ START SERVER
// ============================================================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Blyz Server running on http://localhost:${PORT}`);
  console.log("=========================================");
  console.log("🛰️ WebSocket Live Tracking Enabled");
  console.log("=========================================");
  console.log("🔹 /api/admin/auth/login");
  console.log("🔹 /api/admin/jobs");
  console.log("🔹 /api/admin/operators");
  console.log("🔹 /api/admin/payouts");
  console.log("🔹 /api/admin/dashboard");
});
