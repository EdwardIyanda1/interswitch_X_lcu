import { db } from "./_lib/db.js";
import { sendMail } from "./_lib/mail.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  const firstName = String(body.firstName || body.first_name || "").trim();
  const secondName = String(body.secondName || body.second_name || "").trim();
  const fullName = String(
    body.fullName ||
      body.full_name ||
      body.name ||
      `${firstName} ${secondName}`
  ).trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const matricNumber = String(
    body.matricNumber || body.matric_number || ""
  ).trim();
  const department = String(body.department || "").trim();
  const level = String(body.level || "").trim();
  const hackathonParticipation = String(
    body.hackathonParticipation ||
      body.hackathon_participation ||
      body.focusArea ||
      body.focus_area ||
      body.track ||
      ""
  ).trim();
  const consent = Boolean(body.consent ?? true);

  if (!fullName || !email) {
    return res.status(400).json({ error: "Name and Email are required." });
  }

  try {
    const result = await db.query(
      `INSERT INTO registrations (
         first_name,
         second_name,
         full_name,
         name,
         email,
         phone,
         matric_number,
         department,
         level,
         hackathon_participation,
         focus_area,
         track,
         consent
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (email) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         second_name = EXCLUDED.second_name,
         full_name = EXCLUDED.full_name,
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
         matric_number = EXCLUDED.matric_number,
         department = EXCLUDED.department,
         level = EXCLUDED.level,
         hackathon_participation = EXCLUDED.hackathon_participation,
         focus_area = EXCLUDED.focus_area,
         track = EXCLUDED.track,
         consent = EXCLUDED.consent
       RETURNING *`,
      [
        firstName,
        secondName,
        fullName,
        fullName,
        email,
        phone,
        matricNumber,
        department,
        level,
        hackathonParticipation,
        hackathonParticipation,
        hackathonParticipation,
        consent,
      ]
    );

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      sendMail({
        to: email,
        subject: "Registration Confirmed",
        text: `Hi ${fullName},\n\nYour registration has been received.\n\nMatric Number: ${matricNumber}\nDepartment: ${department}\nLevel: ${level}\nHackathon: ${hackathonParticipation}`,
        html: `<p>Hi <strong>${fullName}</strong>,</p><p>Your registration has been received.</p><ul><li><strong>Matric Number:</strong> ${matricNumber}</li><li><strong>Department:</strong> ${department}</li><li><strong>Level:</strong> ${level}</li><li><strong>Hackathon:</strong> ${hackathonParticipation}</li></ul>`,
      }).catch((mailErr) => {
        console.warn("Mail send warning:", mailErr.message);
      });
    }

    return res.status(201).json({
      message: "Registered",
      registration: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      error: error.message || "Registration failed",
    });
  }
}