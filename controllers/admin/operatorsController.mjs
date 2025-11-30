// ===============================================
// 🔄 RESET OPERATOR GPS LOCATION
// PATCH /admin/operators/:id/reset-location
// ===============================================

import Operator from "../../models/Operator.mjs";

export async function resetOperatorLocation(req, res) {
  try {
    const { id } = req.params;

    const op = await Operator.findById(id);
    if (!op) {
      return res.status(404).json({ ok: false, message: "Operator not found" });
    }

    op.lat = undefined;
    op.lng = undefined;
    op.lastLocationAt = undefined;

    await op.save();

    return res.json({
      ok: true,
      message: "GPS location reset",
    });
  } catch (err) {
    console.error("❌ Reset GPS Error:", err);
    return res.status(500).json({ ok: false, message: "Server error resetting location" });
  }
}
