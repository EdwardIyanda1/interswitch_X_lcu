import "dotenv/config";
import crypto from "node:crypto";
import { config } from "./_lib/config.js";

function createToken(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  const inputUser = String(body.email || body.username || "").trim().toLowerCase();
  const inputPass = String(body.password || "");

  const expectedUser = String(
    config.adminEmail ||
      config.adminUsername ||
      process.env.ADMIN_EMAIL ||
      process.env.ADMIN_USERNAME ||
      ""
  )
    .trim()
    .toLowerCase();

  const expectedPass = String(
    config.adminPassword || process.env.ADMIN_PASSWORD || ""
  );

  if (!expectedUser || !expectedPass) {
    return res.status(500).json({
      error: "ADMIN_USERNAME (or ADMIN_EMAIL) and ADMIN_PASSWORD must be set in .env",
    });
  }

  if (inputUser !== expectedUser || inputPass !== expectedPass) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = createToken(
    {
      sub: expectedUser,
      exp: Date.now() + 1000 * 60 * 60 * 24,
    },
    config.jwtSecret
  );

  return res.status(200).json({ token });
}