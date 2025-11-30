// ============================================================================
// 📸 Operator Photo Uploads — FINAL 2025
// ============================================================================

import express from "express";
import multer from "multer";
import fs from "fs";
import Job from "../../models/Job.mjs";
import operatorAuth from "../../middleware/operatorAuth.mjs";

const router = express.Router();

// Protect all routes
router.use(operatorAuth);

// Ensure uploads exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({ storage }).array("photos", 10);

// POST /api/operator/photos/:id
router.post("/:id", upload, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ ok: false, message: "Job not found" });
    }

    // Determine BEFORE or AFTER group
    const type = req.query.type; // before | after

    const paths = req.files.map((f) => `/uploads/${f.filename}`);

    if (type === "before") {
      job.beforePhotos.push(...paths);
    } else {
      job.afterPhotos.push(...paths);
    }

    await job.save();

    res.json({ ok: true, job });
  } catch (err) {
    console.error("❌ Operator Photo Upload Error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
