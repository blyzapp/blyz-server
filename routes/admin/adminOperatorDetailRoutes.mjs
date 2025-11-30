// ============================================================================
// 📡 Admin Operator Detail Routes — FINAL 2025 BUILD
// ============================================================================

import express from "express";
import requireAdmin from "./adminAuth.mjs";

import {
  getOperatorDetail,
} from "../../controllers/admin/adminOperatorDetailController.mjs";

const router = express.Router();

// ============================================================================
// 🔐 Protect all operator detail routes
// ============================================================================
router.use(requireAdmin);

// ============================================================================
// 👤 GET /api/admin/operators/:id — Get operator details
// ============================================================================
router.get("/:id", getOperatorDetail);

export default router;
