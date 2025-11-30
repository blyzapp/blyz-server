import "dotenv/config";
import jwt from "jsonwebtoken";


const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET;
if (!ADMIN_SECRET) {
  console.error("Missing ADMIN_JWT_SECRET in .env");
  process.exit(1);
}

// Payload for mock admin
const payload = {
  id: "admin-001",
  email: "admin@blyz.com",
  role: "admin",
  name: "Partner B Admin",
};

// Token expires in 7 days
const token = jwt.sign(payload, ADMIN_SECRET, { expiresIn: "7d" });

console.log("✅ MOCK_ADMIN_TOKEN:", token);
