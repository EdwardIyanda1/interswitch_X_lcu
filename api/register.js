import { db } from "./_lib/db.js";
import { sendMail } from "./_lib/mail.js";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildConfirmationEmail({ fullName, email, phone, department, level, hackathon }) {
  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeDept = escapeHtml(department);
  const safeLevel = escapeHtml(level);
  const safeHackathon = escapeHtml(hackathon);

  const badgeBg = hackathon.toLowerCase() === "yes" ? "#e0f7fa" : "#f1f3f9";
  const badgeColor = hackathon.toLowerCase() === "yes" ? "#00796b" : "#394270";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0;padding:0;background-color:#f4f5fa;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#191c30;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f5fa;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 36px rgba(23,25,46,0.12);">
              
              <!-- Top Banner -->
              <tr>
                <td style="background:linear-gradient(135deg,#17192e 0%,#282d52 100%);padding:32px 32px 28px;text-align:left;">
                  <div style="display:inline-block;padding:4px 12px;border-radius:999px;background-color:rgba(56,210,217,0.16);color:#38d2d9;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:14px;">
                    Interswitch &times; Lead City University
                  </div>
                  <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;">
                    Registration Confirmed
                  </h1>
                  <p style="margin:8px 0 0;font-size:14px;color:#c5cae0;line-height:1.5;">
                    Your spot for the Discovery Series &amp; Campus Hackathon has been reserved.
                  </p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding:30px 32px;">
                  <p style="margin:0 0 18px;font-size:15px;color:#191c30;line-height:1.6;">
                    Hi <strong>${safeName}</strong>,
                  </p>
                  <p style="margin:0 0 22px;font-size:14px;color:#484c66;line-height:1.6;">
                    Thank you for registering. Here is a summary of your attendee profile:
                  </p>

                  <!-- Details Card -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f9fd;border:1px solid #e4e7f2;border-radius:12px;padding:6px 18px;">
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:12px;color:#7a7f9a;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                        Full Name
                      </td>
                      <td align="right" style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:14px;color:#191c30;font-weight:600;">
                        ${safeName}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:12px;color:#7a7f9a;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                        Email
                      </td>
                      <td align="right" style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:14px;color:#191c30;font-weight:600;">
                        ${safeEmail}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:12px;color:#7a7f9a;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                        Phone Number
                      </td>
                      <td align="right" style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:14px;color:#191c30;font-weight:600;">
                        ${safePhone}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:12px;color:#7a7f9a;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                        Department
                      </td>
                      <td align="right" style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:14px;color:#191c30;font-weight:600;">
                        ${safeDept}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:12px;color:#7a7f9a;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                        Level
                      </td>
                      <td align="right" style="padding:12px 0;border-bottom:1px solid #e4e7f2;font-size:14px;color:#191c30;font-weight:600;">
                        ${safeLevel}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 0;font-size:12px;color:#7a7f9a;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                        Hackathon Pitch / Participation
                      </td>
                      <td align="right" style="padding:12px 0;">
                        <span style="display:inline-block;padding:4px 12px;border-radius:999px;background-color:${badgeBg};color:${badgeColor};font-size:12px;font-weight:700;">
                          ${safeHackathon}
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8f9fd;border-top:1px solid #e4e7f2;padding:18px 32px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#8c91ab;">
                    Interswitch Discovery Series &bull; Lead City University, Ibadan
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

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
         department,
         level,
         hackathon_participation,
         focus_area,
         track,
         consent
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (email) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         second_name = EXCLUDED.second_name,
         full_name = EXCLUDED.full_name,
         name = EXCLUDED.name,
         phone = EXCLUDED.phone,
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
        subject: "Registration Confirmed — Interswitch x Lead City University",
        text: `Hi ${fullName},\n\nYour registration has been received.\n\nDepartment: ${department}\nLevel: ${level}\nHackathon: ${hackathonParticipation}`,
        html: buildConfirmationEmail({
          fullName,
          email,
          phone,
          department,
          level,
          hackathon: hackathonParticipation,
        }),
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