import crypto from "node:crypto";
import { config } from "./config.js";

const SESSION_MS = 1000 * 60 * 60 * 8;

const b64 = (s) => Buffer.from(s).toString("base64url");

function sign(data) {
  return crypto.createHmac("sha256", config.TOKEN_SECRET).update(data).digest("base64url");
}

export function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function issueToken() {
  const payload = b64(JSON.stringify({ exp: Date.now() + SESSION_MS }));
  return `${payload}.${sign(payload)}`;
}

export function requireAdmin(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const [payload, sig] = token.split(".");
  if (payload && sig && safeEqual(sig, sign(payload))) {
    try {
      const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
      if (typeof exp === "number" && exp > Date.now()) return true;
    } catch {
      /* fall through */
    }
  }
  res.status(401).json({ error: "Your session has ended. Sign in again." });
  return false;
}
