import jwt from "jsonwebtoken";

// Must match JWT_SECRET in backend .env
const JWT_SECRET = "supersecret";

// Payload for mock admin
const payload = {
  role: "admin",
  name: "Dev Admin",
};

// Generate token valid for 7 days
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

console.log("DEV ADMIN JWT:\n", token);
