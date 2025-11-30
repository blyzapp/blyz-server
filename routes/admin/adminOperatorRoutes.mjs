// ============================================================================
// 🛠️ Admin Operator Routes — FINAL 2025 (FULL + DELETE SUPPORT)
// ============================================================================
// Stable, correct imports, and matches Blyz Admin Panel Phase 3
// ============================================================================

import { Router } from "express";
import requireAdmin from "./adminAuth.mjs";

// ============================================================================
// CONTROLLERS (CORRECT PATHS)
// ============================================================================
import {
  getAllOperators,
  getOperatorBasic,
  deleteOperator,   // ✅ DELETE controller
} from "../../controllers/admin/adminOperatorController.mjs";

import {
  getAdminOperatorDetail,
} from "../../controllers/admin/adminOperatorDetailController.mjs";

const router = Router();

// ============================================================================
// 🔐 Protect ALL operator routes
// ============================================================================
router.use(requireAdmin);

// ============================================================================
// ROUTES
// ============================================================================

// --------------------------------------
// GET /api/admin/operators
// List all operators
// --------------------------------------
router.get("/", getAllOperators);

// --------------------------------------
// GET /api/admin/operators/:id/basic
// Minimal profile for dropdown / quick views
// --------------------------------------
router.get("/:id/basic", getOperatorBasic);

// --------------------------------------
// GET /api/admin/operators/:id
// Full operator detail (stats, jobs, location)
// --------------------------------------
router.get("/:id", getAdminOperatorDetail);

// --------------------------------------
// DELETE /api/admin/operators/:id
// Phase 3 — Remove an operator
// --------------------------------------
router.delete("/:id", deleteOperator);

export default router;

