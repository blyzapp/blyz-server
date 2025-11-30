import jwt from "jsonwebtoken";
import "dotenv/config";

const payload = {
  role: "admin",
  name: "Dev Admin",
};

const secret = process.env.JWT_SECRET;

const token = jwt.sign(payload, secret, { expiresIn: "7d" });

console.log("✅ Dev JWT:", token);
