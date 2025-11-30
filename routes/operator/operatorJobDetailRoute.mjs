// ============================================================================
// ❄️ Operator — Job Detail (FINAL 2025)
// ============================================================================

import express from "express";
import Job from "../../models/Job.mjs";
import operatorAuth from "../../middleware/operatorAuth.mjs";

const router = express.Router();

router.use(operatorAuth);

// GET /api/operator/job/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ ok: false, message: "Job not found" });
    }

    res.json({ ok: true, job });
  } catch (err) {
    console.error("❌ Operator Job Detail Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
