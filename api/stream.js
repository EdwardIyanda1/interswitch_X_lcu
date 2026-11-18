import pg from "pg";
import { db } from "./_lib/db.js";
import { verifyToken } from "./_lib/auth.js";

const { Client } = pg;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token =
    req.query?.token ||
    (req.headers?.authorization || "").replace(/^Bearer\s+/i, "").trim();

  if (!verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  const sendEvent = (event, data) => {
    if (!res.writableEnded) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  let listenClient = null;
  let keepAliveTimer = null;
  let closed = false;

  const cleanup = async () => {
    if (closed) return;
    closed = true;
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    if (listenClient) {
      try {
        await listenClient.query("UNLISTEN registrations_channel");
        await listenClient.end();
      } catch {
        // Ignore close errors
      }
    }
    if (!res.writableEnded) {
      res.end();
    }
  };

  req.on("close", cleanup);

  try {
    await db.init();

    // Send initial rows immediately upon connection
    const initial = await db.query(
      `SELECT
         id,
         COALESCE(full_name, name, TRIM(CONCAT(first_name, ' ', second_name))) AS full_name,
         first_name,
         second_name,
         email,
         phone,
         department,
         level,
         COALESCE(hackathon_participation, focus_area, track) AS hackathon_participation,
         created_at
       FROM registrations
       ORDER BY created_at DESC`
    );
    sendEvent("snapshot", { registrations: initial.rows });

    // Open dedicated PostgreSQL LISTEN connection (no Redis required)
    const connectionString = (process.env.DATABASE_URL || "").trim();
    const useSsl =
      process.env.DB_SSL !== "false" &&
      (connectionString.includes("render.com") ||
        process.env.NODE_ENV === "production" ||
        process.env.DB_SSL === "true");

    listenClient = new Client({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    });

    await listenClient.connect();
    await listenClient.query("LISTEN registrations_channel");

    listenClient.on("notification", (msg) => {
      if (msg.channel === "registrations_channel" && msg.payload) {
        try {
          const row = JSON.parse(msg.payload);
          const normalized = {
            ...row,
            full_name:
              row.full_name ||
              row.name ||
              `${row.first_name || ""} ${row.second_name || ""}`.trim(),
            hackathon_participation:
              row.hackathon_participation || row.focus_area || row.track || "",
          };
          sendEvent("upsert", { registration: normalized });
        } catch {
          // Ignore malformed payload
        }
      }
    });

    listenClient.on("error", () => {
      cleanup();
    });

    // Heartbeat every 20s to keep proxy/browser connection open
    keepAliveTimer = setInterval(() => {
      if (!res.writableEnded) {
        res.write(`: ping\n\n`);
      }
    }, 20000);
  } catch (err) {
    sendEvent("error", { error: err.message || "Stream error" });
    await cleanup();
  }
}