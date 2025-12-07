// ============================================================================
// 📊 Admin Analytics Controller — MVP Analytics
// ============================================================================

import User from "../../models/User.mjs";
import Operator from "../../models/Operator.mjs";
import Job from "../../models/Job.mjs";
import Waitlist from "../../models/Waitlist.mjs"; // only if exists, otherwise skip

export async function getAnalytics(req, res) {
  try {
    // Total Users (customers)
    const totalUsers = await User.countDocuments();

    // Total Operators
    const totalOperators = await Operator.countDocuments();

    // Total Jobs
    const totalJobs = await Job.countDocuments();

    // Completed Jobs
    const completedJobs = await Job.countDocuments({ status: "completed" });

    // Waitlist count (ignore if no model yet)
    let waitlistCount = 0;
    try {
      waitlistCount = await Waitlist.countDocuments();
    } catch (err) {
      console.log("⚠️ No Waitlist model loaded yet — skipping.");
    }

    // Revenue — for MVP return 0 or real later
    const revenue = 0;

    return res.json({
      ok: true,
      data: {
        totalUsers,
        totalOperators,
        totalJobs,
        completedJobs,
        waitlistCount,
        revenue,
      },
    });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    return res.status(500).json({ ok: false, error: "Server analytics error" });
  }
}
