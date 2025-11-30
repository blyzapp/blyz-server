// ============================================================================
// ❄️ Operator — Complete Job (FINAL 2025)
// ============================================================================

import express from "express";
import Job from "../../models/Job.mjs";
import operatorAuth from "../../middleware/operatorAuth.mjs";

const router = express.Router();

router.use(operatorAuth);

// POST /api/operator/job/complete/:id
router.post("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ ok: false, message: "Job not found" });
    }

    if (job.status !== "in_progress") {
      return res.status(400).json({
        ok: false,
        message: "Job must be in progress before completing",
      });
    }

    job.status = "completed";
    job.completedAt = new Date();
    await job.save();

    res.json({ ok: true, job });
  } catch (err) {
    console.error("❌ Operator Complete Job Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
