// ============================================================================
// ❄️ Operator — Start Job (FINAL 2025)
// ============================================================================

import express from "express";
import Job from "../../models/Job.mjs";
import operatorAuth from "../../middleware/operatorAuth.mjs";

const router = express.Router();

router.use(operatorAuth);

// POST /api/operator/job/start/:id
router.post("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ ok: false, message: "Job not found" });
    }

    // Only pending jobs can be started
    if (job.status !== "accepted") {
      return res.status(400).json({
        ok: false,
        message: "Job must be accepted before starting",
      });
    }

    job.status = "in_progress";
    job.startedAt = new Date();
    await job.save();

    res.json({ ok: true, job });
  } catch (err) {
    console.error("❌ Operator Start Job Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
