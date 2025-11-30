import express from "express";
import { getWeeklyPayouts, getSinglePayoutWeek } from "../../controllers/admin/adminPayoutController.mjs";
import { requireAdmin } from "./adminAuth.mjs";

const router = express.Router();

// Protect routes with admin middleware
router.get("/", requireAdmin, getWeeklyPayouts);
router.get("/:weekKey", requireAdmin, getSinglePayoutWeek);

export default router;

