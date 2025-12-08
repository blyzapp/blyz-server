// ============================================================================
// 🌐 Public Route — Join Waitlist (FINAL 2025 BUILD)
// - POST /api/waitlist/join
// - Validates request body
// - Calls controller safely
// ============================================================================

import { Router } from "express";
import { joinWaitlist } from "../../controllers/public/waitlistController.mjs";

const router = Router();

// -----------------------------------------------------------------------------
// POST /api/waitlist/join
// -----------------------------------------------------------------------------
router.post("/join", async (req, res) => {
  try {
    // Ensure JSON body is present
    if (!req.body || typeof req.body !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request body" });
    }

    // Controller handles saving + email processing
    const result = await joinWaitlist(req, res);

    // If controller already sent a response, do not send twice
    if (res.headersSent) return;

    // Always wrap result
    res.status(200).json({
      success: true,
      message: "You have been added to the waitlist!",
      data: result,
    });
  } catch (error) {
    console.error("❌ Waitlist Error:", error.message);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to join waitlist",
      });
    }
  }
});

// -----------------------------------------------------------------------------
// EXPORT ROUTER
// -----------------------------------------------------------------------------
export default router;
