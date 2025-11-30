// ============================================================================
// 🧊 Admin Operator Detail Controller — Blyz Server (2025 FINAL BUILD)
// ============================================================================
// Matches Admin Panel expectations EXACTLY:
//   • operator
//   • jobs (array)
//   • ok: true
// ============================================================================

import Operator from "../../models/Operator.mjs";
import Job from "../../models/Job.mjs";

// ============================================================================
// GET /api/admin/operators/:id
// Returns full operator detail + last 50 jobs
// ============================================================================
export const getAdminOperatorDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // -------------------------------------------------------------------------
    // 1️⃣ Load operator
    // -------------------------------------------------------------------------
    const operator = await Operator.findById(id).lean();
    if (!operator) {
      return res.status(404).json({
        ok: false,
        message: "Operator not found",
      });
    }

    // -------------------------------------------------------------------------
    // 2️⃣ Load last 50 jobs (this matches Admin UI expectations)
    // -------------------------------------------------------------------------
    const jobs = await Job.find({ operatorId: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("customerName address status price createdAt")
      .lean();

    // -------------------------------------------------------------------------
    // 3️⃣ Return EXACT SHAPE the frontend expects
    // -------------------------------------------------------------------------
    return res.json({
      ok: true,
      operator,
      jobs,
    });

  } catch (err) {
    console.error("❌ getAdminOperatorDetail error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error loading operator detail",
    });
  }
};
