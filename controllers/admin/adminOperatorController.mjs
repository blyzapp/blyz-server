// ============================================================================
// 🧊 Admin Operator Controller — Blyz Server (2025 FINAL BUILD)
// ============================================================================

// Models
import Operator from "../../models/Operator.mjs";
import Job from "../../models/Job.mjs";

// ============================================================================
// GET /api/admin/operators
// Returns a list of all operators
// ============================================================================
export const getAllOperators = async (req, res) => {
  try {
    const operators = await Operator.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      ok: true,
      operators,
    });
  } catch (err) {
    console.error("❌ getAllOperators error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error loading operators",
    });
  }
};

// ============================================================================
// GET /api/admin/operators/:id/basic
// Minimal operator data for dropdowns, lookups, quick views
// ============================================================================
export const getOperatorBasic = async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id)
      .select("name email phone status createdAt")
      .lean();

    if (!operator) {
      return res.status(404).json({
        ok: false,
        message: "Operator not found",
      });
    }

    return res.json({
      ok: true,
      operator,
    });
  } catch (err) {
    console.error("❌ getOperatorBasic error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error loading operator",
    });
  }
};

// ============================================================================
// DELETE /api/admin/operators/:id
// FULL HARD DELETE (Phase 3)
// ============================================================================
// - Removes the operator permanently
// - Optional: Delete their job history
// ============================================================================
export const deleteOperator = async (req, res) => {
  try {
    const operatorId = req.params.id;

    // 1. Check existence
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return res.status(404).json({
        ok: false,
        message: "Operator not found",
      });
    }

    // 2. Optional job removal — disabled for now
    // await Job.deleteMany({ operatorId });

    // 3. Delete operator
    await operator.deleteOne();

    return res.json({
      ok: true,
      message: "Operator deleted successfully",
    });
  } catch (err) {
    console.error("❌ deleteOperator error:", err);
    return res.status(500).json({
      ok: false,
      message: "Failed to delete operator",
    });
  }
};
