// ============================================================================
// ❄️ Operator — Available Jobs (FINAL 2025)
// ============================================================================

import express from "express";
import Job from "../../models/Job.mjs";
import operatorAuth from "../../middleware/operatorAuth.mjs";

const router = express.Router();

// Protect all routes
router.use(operatorAuth);

// GET /api/operator/jobs/available
router.get("/available", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "pending" }).sort({ createdAt: -1 });

    res.json({
      ok: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("❌ Operator Available Jobs Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
