import express from "express";

import adminAuthRouter from "./admin/authRoutes.mjs";
import adminJobsRouter from "./admin/jobsRoutes.mjs";
import adminOperatorsRouter from "./admin/operatorsRoutes.mjs";
import adminPayoutsRouter from "./admin/payoutsRoutes.mjs";
import adminWaitlistRouter from "./admin/waitlistRoutes.mjs";
import adminDashboardRouter from "./admin/dashboardRoutes.mjs";

const router = express.Router();

router.use("/auth", adminAuthRouter);
router.use("/jobs", adminJobsRouter);
router.use("/operators", adminOperatorsRouter);
router.use("/payouts", adminPayoutsRouter);
router.use("/waitlist", adminWaitlistRouter);
router.use("/dashboard", adminDashboardRouter);

export default router;
