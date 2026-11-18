import { db } from "./_lib/db.js";
import { requireAdmin } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const pool = await db();

    if (req.method === "GET") {
      const { rows } = await pool.query(
        `SELECT id, first_name AS "firstName", last_name AS "lastName", phone, email,
                department, level, created_at AS "createdAt"
         FROM registrations ORDER BY created_at DESC`
      );
      return res.status(200).json({ registrations: rows });
    }

    if (req.method === "DELETE") {
      const id = Number.parseInt(req.query.id, 10);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id." });
      await pool.query("DELETE FROM registrations WHERE id = $1", [id]);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, DELETE");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    console.error("registrations: error", err);
    return res.status(500).json({ error: "Could not reach the database." });
  }
}
