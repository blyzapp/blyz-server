import { Router } from "express";
import OperatorWaitlist from "../../models/OperatorWaitlist.mjs";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, vehicle } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ ok: false, message: "Email is required" });
    }

    const entry = await OperatorWaitlist.create({
      name,
      email: email.trim().toLowerCase(),
      phone,
      vehicle,
      joinedAt: new Date(),
    });

    return res.json({ ok: true, data: entry });
  } catch (err) {
    console.error("Operator waitlist error:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Error saving operator signup" });
  }
});

export default router;
