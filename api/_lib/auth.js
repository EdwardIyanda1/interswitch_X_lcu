import "dotenv/config";
import crypto from "node:crypto";
import { config } from "./config.js";

const SECRET =
  config.jwtSecret ||
  process.env.JWT_SECRET ||
  process.env.ADMIN_SECRET ||
  "discovery-secret-key";

export function createToken(payload, secret = SECRET) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64url");
  return `${data}.${signature}`;
}

export function verifyToken(token, secret = SECRET) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64url");

  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(req) {
  const authHeader =
    (req.headers && (req.headers.authorization || req.headers.Authorization)) ||
    "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token) return null;
  return verifyToken(token);
}

export default {
  createToken,
  verifyToken,
  requireAuth,
};