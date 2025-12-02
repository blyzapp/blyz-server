// ============================================================================
// 🌐 Public Route — Join Waitlist
// ============================================================================
import { Router } from "express";
import { joinWaitlist } from "../../controllers/public/waitlistController.mjs";

const r = Router();

r.post("/join", joinWaitlist);

export default r;
