// ============================================================================
// 📋 Admin Operators Controller — FULL OPERATOR METRICS (FINAL 2025 BUILD)
// ============================================================================
// Returns complete live operator stats:
// - Basic profile: name, email, phone, status, rating
// - Job stats: pending, active, completed
// - Earnings: operator payout totals
// - Joined date
// ============================================================================

import User from "../../models/User.mjs";
import Job from "../../models/Job.mjs";

export async function getAllOperators(req, res) {
  try {
    // 1. Get all operators
    const operators = await User.find({ role: "operator" }).lean();

    // 2. Get ALL jobs that have ANY operator assigned
    const jobs = await Job.find({ operatorId: { $ne: null } }).lean();

    // 3. Build FULL operator stats
    const formatted = operators.map((op) => {
      // All jobs for this operator
      const opJobs = jobs.filter(
        (job) => String(job.operatorId) === String(op._id)
      );

      // Pending jobs (requested but not started)
      const pendingJobs = opJobs.filter(
        (job) => job.status === "pending"
      ).length;

      // Active jobs (accepted or in progress)
      const activeJobs = opJobs.filter(
        (job) =>
          job.status === "accepted" ||
          job.status === "in_progress"
      ).length;

      // Completed jobs
      const completedJobs = opJobs.filter(
        (job) => job.status === "completed"
      ).length;

      // Total operator earnings (for completed jobs)
      const totalEarnings = opJobs
        .filter((job) => job.status === "completed")
        .reduce((sum, job) => sum + (job.operatorEarnings || 0), 0);

      return {
        // ID + profile
        _id: op._id,
        name: op.name,
        email: op.email,
        phone: op.phone || "",
        status: op.status || "offline",

        // Stats
        rating: op.rating ?? 0,
        pendingJobs,
        activeJobs,
        completedJobs,
        totalEarnings,

        // Dates
        joinedAt: op.createdAt,
      };
    });

    return res.json({
      ok: true,
      operators: formatted,
    });
  } catch (err) {
    console.error("❌ Admin Operators Error:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Server error fetching operators" });
  }
}
