// ============================================================================
// 🟦 Admin Dashboard Routes — Blyz Server (2025 FINAL BUILD)
// ============================================================================
// - Fully protected by requireAdmin
// - Returns KPIs, charts, recent jobs, operator locations
// ============================================================================

import express from "express";
import requireAdmin from "./adminAuth.mjs";

import Job from "../../models/Job.mjs";
import User from "../../models/User.mjs";

const router = express.Router();

// ============================================================================
// 🔐 Protect ALL dashboard routes
// ============================================================================
router.use(requireAdmin);

// ============================================================================
// GET /api/admin/dashboard
// ============================================================================
router.get("/", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ------------------------------------------------------------------------
    // KPI STATS
    // ------------------------------------------------------------------------
    const todayJobs = await Job.countDocuments({
      createdAt: { $gte: today },
    });

    const activeOperators = await User.countDocuments({
      role: "operator",
      status: "online",
    });

    const payoutsPending = await Job.countDocuments({
      status: "completed",
      operatorId: { $ne: null },
      payoutSent: { $ne: true },
    });

    const totalOperators = await User.countDocuments({
      role: "operator",
    });

    // ------------------------------------------------------------------------
    // Jobs per day (last 7 days)
    // ------------------------------------------------------------------------
    const jobsPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const count = await Job.countDocuments({
        createdAt: {
          $gte: d,
          $lt: new Date(d.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      jobsPerDay.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        jobs: count,
      });
    }

    // ------------------------------------------------------------------------
    // Weekly Revenue (last 6 weeks)
    // ------------------------------------------------------------------------
    const weeklyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(
        weekStart.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      const jobsInWeek = await Job.find({
        createdAt: { $gte: weekStart, $lt: weekEnd },
      });

      const revenue = jobsInWeek.reduce(
        (sum, j) => sum + (j.price || 0),
        0
      );

      weeklyRevenue.push({
        week: `W${getWeekNumber(weekStart)}`,
        revenue,
      });
    }

    // ------------------------------------------------------------------------
    // Recent Jobs (last 10)
    // ------------------------------------------------------------------------
    const recentJobsData = await Job.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("operatorId")
      .populate("customerId")
      .lean();

    const recentJobs = recentJobsData.map((j) => ({
      id: j._id,
      customerName: j.customerId?.name || "Unknown",
      address: j.address,
      status: j.status,
      createdAt: j.createdAt,
    }));

    // ------------------------------------------------------------------------
    // Online operator locations
    // ------------------------------------------------------------------------
    const operatorsData = await User.find({
      role: "operator",
      status: "online",
    }).lean();

    const operatorLocations = operatorsData.map((op) => ({
      name: op.name,
      lat: op.lat ?? 43.6532, // Default: Toronto fallback
      lng: op.lng ?? -79.3832,
      status: op.status,
    }));

    // ------------------------------------------------------------------------
    // Operator list for filter dropdown
    // ------------------------------------------------------------------------
    const operatorsList = operatorsData.map((op) => op.name);

    // ------------------------------------------------------------------------
    // RETURN FINAL DASHBOARD PAYLOAD
    // ------------------------------------------------------------------------
    res.json({
      ok: true,
      stats: {
        todayJobs,
        activeOperators,
        payoutsPending,
        totalOperators,
      },
      jobsPerDay,
      weeklyRevenue,
      recentJobs,
      operatorLocations,
      operatorsList,
    });

  } catch (err) {
    console.error("❌ Dashboard route error:", err);
    res
      .status(500)
      .json({ ok: false, message: "Failed to fetch dashboard data" });
  }
});

// ============================================================================
// Helper: Get Week Number
// ============================================================================
function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

export default router;
