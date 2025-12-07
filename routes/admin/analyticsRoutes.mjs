// ============================================================================
// 🌐 Admin Analytics Routes — MVP (FINAL 2025 BUILD)
// ============================================================================

import express from "express";
import requireAdmin from "../../middleware/adminAuth.mjs"; 
import { getAnalytics } from "../../controllers/admin/analyticsController.mjs";

const router = express.Router();

console.log("▶️ admin/analyticsRoutes.mjs loaded");

// ============================================================================
// 🔐 Protect ALL analytics routes
// ============================================================================
router.use(requireAdmin);

// ============================================================================
// 📊 GET /api/admin/analytics
// ============================================================================
router.get("/", getAnalytics);

export default router;
