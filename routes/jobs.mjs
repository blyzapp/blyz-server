// ============================================================================
// ❄️ Blyz Customer Jobs Routes — FINAL 2025 BUILD
// ============================================================================
// - Customer creates job
// - Customer views job list
// - Admin panel reads these jobs through admin routes
// ============================================================================

import express from "express";
import Job from "../models/Job.mjs";
import auth from "../middleware/auth.mjs";

const router = express.Router();

// ============================================================================
// POST /api/jobs/create
// Customer creates a snow removal job
// ============================================================================
router.post("/create", auth, async (req, res) => {
  try {
    const {
      address,
      price,
      notes,
      lat,
      lng,
      size,
      type
    } = req.body;

    if (!address || !price) {
      return res.status(400).json({
        ok: false,
        message: "Missing required fields"
      });
    }

    const job = await Job.create({
      customerId: req.userId,
      address,
      price,
      notes,
      lat,
      lng,
      size,
      type,
      status: "pending",
      createdAt: new Date()
    });

    res.json({
      ok: true,
      job
    });
  } catch (err) {
    console.error("❌ Create Job Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ============================================================================
// GET /api/jobs/my
// Customer views their own job history
// ============================================================================
router.get("/my", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ customerId: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      ok: true,
      count: jobs.length,
      jobs
    });
  } catch (err) {
    console.error("❌ Fetch Customer Jobs Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ============================================================================
// GET /api/jobs/:id
// Customer views a single job detail
// ============================================================================
router.get("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      customerId: req.userId
    });

    if (!job) {
      return res.status(404).json({
        ok: false,
        message: "Job not found"
      });
    }

    res.json({ ok: true, job });
  } catch (err) {
    console.error("❌ Fetch Single Job Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
