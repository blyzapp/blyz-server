// ============================================================================
// 📧 Blyz Waitlist Controller — Save Public Signups to MongoDB
// ============================================================================
import { Resend } from "resend";
import waitlistEmailTemplate from "../../email/waitlistEmailTemplate.mjs";
import Waitlist from "../../models/Waitlist.mjs"; // Import model

// Init Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(req, res) {
  try {
    const { email, phone, name } = req.body;

    // Validate email
    if (!email || !email.includes("@")) {
      return res.status(400).json({ ok: false, msg: "Valid email is required" });
    }

    // Save to MongoDB
    const entry = await Waitlist.create({
      email,
      phone: phone || "",
      name: name || "",
      source: "public",
      joinedAt: new Date(),
    });

    // Build email HTML
    const html = waitlistEmailTemplate(email);

    // Notify admin
    await resend.emails.send({
      from: process.env.WAITLIST_FROM,
      to: process.env.WAITLIST_NOTIFY_TO,
      subject: `New Blyz Waitlist Signup: ${email}`,
      html,
    });

    // Confirmation to user
    await resend.emails.send({
      from: process.env.WAITLIST_FROM,
      to: email,
      subject: "You're on the Blyz Waitlist! ❄️",
      html,
    });

    return res.json({ ok: true, msg: "Email submitted successfully", data: entry });

  } catch (err) {
    console.error("❌ Waitlist Error:", err);
    return res.status(500).json({
      ok: false,
      msg: "Server error — could not process signup",
    });
  }
}
