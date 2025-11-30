// ============================================================================
// 💸 Admin Payout Routes — FINAL 2025 SECURED BUILD
// ============================================================================

import express from "express";
import requireAdmin from "./adminAuth.mjs";

import {
  getWeeklyPayouts,
  getSinglePayoutWeek,
} from "../../controllers/admin/adminPayoutController.mjs";

const router = express.Router();

// ============================================================================
// 🔐 Protect all payout routes
// ============================================================================
router.use(requireAdmin);

// ============================================================================
// 📅 GET /api/admin/payouts — All weekly payout summaries
// ============================================================================
router.get("/", getWeeklyPayouts);

// ============================================================================
// 📆 GET /api/admin/payouts/:weekKey — Detail for a specific week
// ============================================================================
router.get("/:weekKey", getSinglePayoutWeek);

export default router;
