// ============================================================================
// 📧 Blyz Waitlist Controller — Save Public Signups to MongoDB (FINAL BUILD)
// ============================================================================
import { Resend } from "resend";
import waitlistEmailTemplate from "../../email/waitlistEmailTemplate.mjs";
import Waitlist from "../../models/Waitlist.mjs";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================================================
// POST /api/waitlist/join
// ============================================================================
export async function joinWaitlist(req, res) {
  try {
    const { email, phone, name } = req.body || {};

    // --------------------------------------
    // VALIDATION
    // --------------------------------------
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({
        ok: false,
        message: "A valid email is required.",
      });
    }

    // Normalize user data
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || "";
    const cleanPhone = phone?.trim() || "";

    // --------------------------------------
    // PREVENT DUPLICATES
    // --------------------------------------
    const existing = await Waitlist.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(200).json({
        ok: true,
        duplicate: true,
        message: "Already on the waitlist",
        data: existing,
      });
    }

    // --------------------------------------
    // SAVE TO MONGO
    // --------------------------------------
    const newEntry = await Waitlist.create({
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      source: "public",
      joinedAt: new Date(),
    });

    // --------------------------------------
    // BUILD EMAIL HTML
    // --------------------------------------
    const html = waitlistEmailTemplate(cleanEmail);

    // --------------------------------------
    // SEND EMAILS SAFELY
    // - We never want email failure to block signup
    // --------------------------------------
    try {
      // Notify admin
      await resend.emails.send({
        from: process.env.WAITLIST_FROM,
        to: process.env.WAITLIST_NOTIFY_TO,
        subject: `📬 New Blyz Waitlist Signup – ${cleanEmail}`,
        html,
      });

      // Confirmation to user
      await resend.emails.send({
        from: process.env.WAITLIST_FROM,
        to: cleanEmail,
        subject: "Welcome to the Blyz Waitlist! ❄️",
        html,
      });
    } catch (emailErr) {
      console.error("⚠️ Email sending failed:", emailErr.message);
      // DO NOT return — signup succeeded
    }

    // --------------------------------------
    // RETURN SUCCESS RESPONSE
    // --------------------------------------
    return res.json({
      ok: true,
      message: "Successfully joined the waitlist!",
      data: newEntry,
    });

  } catch (err) {
    console.error("❌ Waitlist Controller Error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error — could not process waitlist signup.",
    });
  }
}
