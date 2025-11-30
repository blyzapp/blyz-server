// ============================================================================
// 🧊 Admin Job Controller — Blyz Server (FINAL 2025)
// ============================================================================

import Job from "../../models/Job.mjs";
import User from "../../models/User.mjs";

// -------------------------------------------
// GET ALL JOBS
// -------------------------------------------
export async function getAllJobs(req, res) {
  try {
    const jobs = await Job.find()
      .populate("operatorId", "name email phone rating")
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    // Transform jobs for frontend
    const jobsForFrontend = jobs.map((j) => ({
      _id: j._id,
      customerName: j.customerId?.name || "Unknown",
      address: j.address,
      status: j.status,
      price: j.price,
      operatorName: j.operatorId?.name || null,
      createdAt: j.createdAt,
    }));

    res.json({ ok: true, jobs: jobsForFrontend });
  } catch (err) {
    console.error("Admin getAllJobs error:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch jobs" });
  }
}

// -------------------------------------------
// GET SINGLE JOB
// -------------------------------------------
export async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id)
      .populate("operatorId", "name email phone rating")
      .populate("customerId", "name email phone")
      .lean();

    if (!job)
      return res.status(404).json({ ok: false, message: "Job not found" });

    const jobDetail = {
      _id: job._id,
      status: job.status,
      createdAt: job.createdAt,
      scheduledAt: job.scheduledAt,
      completedAt: job.completedAt,
      price: job.price,
      address: job.address,
      unit: job.unit,
      city: job.city,
      customer: job.customerId
        ? { name: job.customerId.name, email: job.customerId.email, phone: job.customerId.phone }
        : { name: "Unknown", email: "", phone: "" },
      operator: job.operatorId
        ? { name: job.operatorId.name, email: job.operatorId.email, phone: job.operatorId.phone, rating: job.operatorId.rating }
        : undefined,
      snowType: job.snowType,
      vehicleAccess: job.vehicleAccess,
      notes: job.notes,
      timeline: job.timeline || [],
      beforePhotos: job.beforePhotos || [],
      afterPhotos: job.afterPhotos || [],
    };

    res.json({ ok: true, job: jobDetail });
  } catch (err) {
    console.error("Admin getJobById error:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch job details" });
  }
}

// -------------------------------------------
// FORCE UPDATE STATUS
// -------------------------------------------
export async function forceUpdateStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status)
      return res.status(400).json({ ok: false, message: "Missing status" });

    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ ok: false, message: "Job not found" });

    job.status = status;
    job.timeline.push({
      label: `Status changed to ${status}`,
      at: new Date().toISOString(),
      type: status,
    });

    await job.save();

    res.json({ ok: true, job });
  } catch (err) {
    console.error("Admin forceUpdateStatus error:", err);
    res.status(500).json({ ok: false, message: "Failed to update status" });
  }
}

// -------------------------------------------
// REASSIGN OPERATOR
// -------------------------------------------
export async function reassignOperator(req, res) {
  try {
    const { operatorId } = req.body;
    if (!operatorId)
      return res.status(400).json({ ok: false, message: "Missing operatorId" });

    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ ok: false, message: "Job not found" });

    const operator = await User.findById(operatorId);
    if (!operator)
      return res.status(404).json({ ok: false, message: "Operator not found" });

    job.operatorId = operatorId;
    job.timeline.push({
      label: `Reassigned to ${operator.name}`,
      at: new Date().toISOString(),
      type: "accepted",
    });

    await job.save();

    res.json({ ok: true, job });
  } catch (err) {
    console.error("Admin reassignOperator error:", err);
    res.status(500).json({ ok: false, message: "Failed to reassign operator" });
  }
}
