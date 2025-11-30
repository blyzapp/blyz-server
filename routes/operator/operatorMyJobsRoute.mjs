// ============================================================================
// ❄️ Operator — My Jobs (FINAL 2025)
// ============================================================================

import express from "express";
import Job from "../../models/Job.mjs";
import operatorAuth from "../../middleware/operatorAuth.mjs";

const router = express.Router();

router.use(operatorAuth);

// GET /api/operator/my
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ operatorId: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("❌ Operator My Jobs Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
