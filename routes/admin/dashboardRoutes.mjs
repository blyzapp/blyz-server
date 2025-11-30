// routes/admin/dashboardRoutes.mjs
// ============================================================================
// Blyz Admin — Dashboard Analytics Route
// GET /api/admin/dashboard
// ============================================================================

import { Router } from "express";
import { getAdminDashboard } from "../../controllers/admin/dashboardController.mjs";

const router = Router();

// GET /api/admin/dashboard
router.get("/", getAdminDashboard);

export default router;
