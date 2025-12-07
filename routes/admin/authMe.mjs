// ============================================================================
// 🟦 GET AUTHENTICATED ADMIN — FINAL 2025 R4
// GET /api/admin/auth/me
// - Validates JWT via requireAdmin middleware
// - Returns clean admin object
// - Fully stable for DEV + PROD
// ============================================================================

router.get("/me", requireAdmin, async (req, res) => {
  try {
    // ---------------------------------------------------------------
    // ⭐ req.admin is injected directly by requireAdmin middleware
    // ---------------------------------------------------------------
    if (!req.admin) {
      return res.status(401).json({
        ok: false,
        message: "Not authenticated",
      });
    }

    return res.json({
      ok: true,
      admin: {
        name: req.admin.name,
        email: req.admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("❌ /auth/me error:", err);
    return res.status(500).json({
      ok: false,
      message: "Server error retrieving admin",
    });
  }
});
