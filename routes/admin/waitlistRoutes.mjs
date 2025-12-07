// ============================================================================
// 🌐 Admin Waitlist Routes — FINAL 2025 R5 BUILD
// - Fully JWT-protected
// - Works with DEV bypass mode
// - Clean, stable CRUD endpoints
// ============================================================================

import express from "express";
import requireAdmin from "../../middleware/adminAuth.mjs";

import {
  getWaitlist,
  addWaitlistEntry,
  deleteWaitlistEntry,
} from "../../controllers/admin/waitlistController.mjs";

const router = express.Router();

// ============================================================================
// 🔐 PROTECT ALL ROUTES
// Everything under /api/admin/waitlist requires admin authentication
// ============================================================================
router.use(requireAdmin);

// ============================================================================
// 📌 GET — Fetch all waitlist entries
// GET /api/admin/waitlist
// ============================================================================
router.get("/", getWaitlist);

// ============================================================================
// ➕ POST — Add new waitlist entry
// POST /api/admin/waitlist
// ============================================================================
router.post("/", addWaitlistEntry);

// ============================================================================
// ❌ DELETE — Remove a waitlist entry
// DELETE /api/admin/waitlist/:id
// ============================================================================
router.delete("/:id", deleteWaitlistEntry);

export default router;

