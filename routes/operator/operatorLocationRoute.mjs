// routes/operator/operatorLocationRoute.mjs
// ============================================================================
// 🟦 Blyz Operator GPS Update Route (Phase B4.2)
// Updates operator coordinates for live admin map
// ============================================================================

import express from "express";
import User from "../../models/User.mjs";
import { requireOperator } from "./operatorAuth.mjs"; // your operator auth middleware

const router = express.Router();

// ============================================================================
// POST /api/operator/location/update
// Body: { lat: Number, lng: Number }
// ============================================================================

router.post("/update", requireOperator, async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({
        ok: false,
        message: "Missing latitude or longitude",
      });
    }

    // Update operator's coordinates and timestamp
    await User.findByIdAndUpdate(req.userId, {
      lat,
      lng,
      lastLocationAt: new Date(),
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Operator GPS update error:", err);
    return res.status(500).json({ ok: false, message: "Server error updating location" });
  }
});

export default router;
