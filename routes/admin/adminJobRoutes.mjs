// ============================================================================
// 🧊 Admin Job Routes — Blyz Server (FINAL 2025 SECURED BUILD)
// ============================================================================

import express from "express";
import requireAdmin from "./adminAuth.mjs";

import {
  getAllJobs,
  getJobById,
  forceUpdateStatus,
  reassignOperator,
} from "../../controllers/admin/adminJobController.mjs";

const router = express.Router();

// ============================================================================
// 🔐 Protect all admin job routes
// ============================================================================
router.use(requireAdmin);

// ============================================================================
// 📋 GET all jobs
// ============================================================================
router.get("/", getAllJobs);

// ============================================================================
// 📄 GET job detail by ID
// ============================================================================
router.get("/:id", getJobById);

// ============================================================================
// 🔧 POST → Force update job status (admin override)
// ============================================================================
router.post("/:id/status", forceUpdateStatus);

// ============================================================================
// 🔄 POST → Reassign operator to a job
// ============================================================================
router.post("/:id/reassign", reassignOperator);

export default router;
