import { db } from "./_lib/db.js";
import { requireAuth } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = requireAuth(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await db.query(
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
         COALESCE(focus_area, track) AS focus_area,
         COALESCE(track, focus_area) AS track,
         consent,
         created_at
       FROM registrations
       ORDER BY created_at DESC`
    );

    return res.status(200).json({
      registrations: result.rows,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return res.status(500).json({
      error: error.message || "Failed to load registrations",
    });
  }
}