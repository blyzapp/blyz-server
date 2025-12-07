// ============================================================================
// 📧 Blyz Waitlist Controller — FINAL FIXED BUILD (Saves to MongoDB)
// ============================================================================

import { Resend } from "resend";
import waitlistEmailTemplate from "../../email/waitlistEmailTemplate.mjs";
import Waitlist from "../../models/Waitlist.mjs";   // ⭐ FIXED — IMPORT MODEL

// Init Resend with API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(req, res) {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email || !email.includes("@")) {
      return res.status(400).json({ ok: false, msg: "Valid email is required" });
    }

    // ⭐ FIXED — Save email to database
    await Waitlist.create({
      email,
      source: "public",
    });

    // Build email HTML
    const html = waitlistEmailTemplate(email);

    // 1️⃣ Notify YOU of a new signup
    await resend.emails.send({
      from: process.env.WAITLIST_FROM,
      to: process.env.WAITLIST_NOTIFY_TO,
      subject: `New Blyz Waitlist Signup: ${email}`,
      html,
    });

    // 2️⃣ Send confirmation to USER
    await resend.emails.send({
      from: process.env.WAITLIST_FROM,
      to: email,
      subject: "You're on the Blyz Waitlist! ❄️",
      html,
    });

    return res.json({ ok: true, msg: "Email submitted successfully" });

  } catch (err) {
    console.error("❌ Waitlist Error:", err);
    return res.status(500).json({
      ok: false,
      msg: "Server error — could not send emails",
    });
  }
}
