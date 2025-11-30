// controllers/admin/dashboardController.mjs
// ============================================================================
// 📊 Blyz Admin — Dashboard Analytics Controller
// - Jobs + Operators + Revenue + Payout metrics
// - Last 7 days stats for charts
// - Recent jobs & operators
// ============================================================================

import Job from "../../models/Job.mjs";
import Operator from "../../models/Operator.mjs";

export async function getAdminDashboard(req, res) {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);

    // ------------------------------------------------------------
    // BASIC COUNTS
    // ------------------------------------------------------------
    const [
      totalOperators,
      onlineOperators,
      totalJobs,
      pendingJobs,
      inProgressJobs,
      completedJobs,
    ] = await Promise.all([
      Operator.countDocuments({}),
      Operator.countDocuments({ isOnline: true }),

      Job.countDocuments({}),
      Job.countDocuments({ status: "pending" }),

      Job.countDocuments({
        status: { $in: ["accepted", "en_route", "in_progress"] },
      }),

      Job.countDocuments({ status: "completed" }),
    ]);

    // ------------------------------------------------------------
    // JOBS LAST 7 DAYS
    // ------------------------------------------------------------
    const jobsLast7Raw = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ------------------------------------------------------------
    // REVENUE LAST 7 DAYS (completed jobs only)
    // ------------------------------------------------------------
    const revenueLast7Raw = await Job.aggregate([
      {
        $match: {
          status: "completed",
          completedAt: { $gte: sevenDaysAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          amount: { $sum: "$price" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ------------------------------------------------------------
    // FORMAT 7 DAY SERIES
    // ------------------------------------------------------------
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD

      const jobsEntry = jobsLast7Raw.find((j) => j._id === key);
      const revenueEntry = revenueLast7Raw.find((r) => r._id === key);

      days.push({
        date: key,
        jobs: jobsEntry ? jobsEntry.count : 0,
        revenue: revenueEntry ? revenueEntry.amount : 0,
      });
    }

    const totalRevenueLast7Days = days.reduce((sum, d) => sum + d.revenue, 0);

    // ------------------------------------------------------------
    // RECENT JOBS
    // ------------------------------------------------------------
    const recentJobs = await Job.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("id customerName operatorName status price createdAt");

    // ------------------------------------------------------------
    // RECENT OPERATORS
    // ------------------------------------------------------------
    const recentOperators = await Operator.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email phone isOnline createdAt");

    // ------------------------------------------------------------
    // TEMPORARY PAYOUTS (70% of revenue last 7 days)
    // ------------------------------------------------------------
    const payoutsPending = totalRevenueLast7Days * 0.7;

    // ------------------------------------------------------------
    // RESPONSE
    // ------------------------------------------------------------
    return res.json({
      stats: {
        totalOperators,
        onlineOperators,
        totalJobs,
        pendingJobs,
        inProgressJobs,
        completedJobs,
        totalRevenueLast7Days,
        payoutsPending,
      },
      charts: {
        last7Days: days,
      },
      recentJobs,
      recentOperators,
    });
  } catch (err) {
    console.error("❌ Admin dashboard error:", err);
    return res.status(500).json({ message: "Failed to load admin dashboard" });
  }
}
