import PayoutWeek from "../../models/PayoutWeek.mjs";

export async function getWeeklyPayouts(req, res) {
  try {
    const weeks = await PayoutWeek.find().sort({ startDate: -1 });
    return res.status(200).json({ ok: true, count: weeks.length, weeks });
  } catch (err) {
    console.error("❌ Admin payout error:", err);
    return res.status(500).json({ ok: false, message: "Server error fetching payout weeks" });
  }
}

export async function getSinglePayoutWeek(req, res) {
  try {
    const { weekKey } = req.params;
    const week = await PayoutWeek.findOne({ weekKey });

    if (!week) {
      return res.status(404).json({ ok: false, message: "Payout week not found" });
    }

    return res.status(200).json({ ok: true, week });
  } catch (err) {
    console.error("❌ Admin payout detail error:", err);
    return res.status(500).json({ ok: false, message: "Server error fetching payout week" });
  }
}
