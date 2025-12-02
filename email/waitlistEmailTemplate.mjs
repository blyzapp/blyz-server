// ============================================================================
// 📧 Blyz Waitlist Email Template
// ============================================================================
export default function waitlistEmailTemplate(email) {
  return `
    <div style="font-family: Arial; padding: 24px;">
      <h2>👋 Thanks for Joining the Blyz Waitlist!</h2>

      <p>We're excited to have you on board. As soon as Blyz launches in your area, 
      you'll be the first to know.</p>

      <p style="margin-top: 20px;">
        <strong>Your email:</strong> ${email}
      </p>

      <p style="margin-top: 30px;">Talk soon,<br>The Blyz Team ❄️</p>
    </div>
  `;
}
