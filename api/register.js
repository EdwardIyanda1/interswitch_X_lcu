import { db } from "./_lib/db.js";
import { sendConfirmation } from "./_lib/mail.js";

const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "Postgraduate"];

const clean = (v) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const reg = {
    firstName: clean(body.firstName),
    lastName: clean(body.lastName),
    phone: clean(body.phone),
    email: clean(body.email).toLowerCase(),
    department: clean(body.department),
    level: clean(body.level),
  };

  const errors = {};
  if (reg.firstName.length < 2 || reg.firstName.length > 60) errors.firstName = "Enter your first name.";
  if (reg.lastName.length < 2 || reg.lastName.length > 60) errors.lastName = "Enter your last name.";
  if (!/^\+?[0-9\s-]{10,16}$/.test(reg.phone)) errors.phone = "Enter a valid phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(reg.email) || reg.email.length > 120)
    errors.email = "Enter a valid email address.";
  if (reg.department.length < 2 || reg.department.length > 100) errors.department = "Enter your department.";
  if (!LEVELS.includes(reg.level)) errors.level = "Select your level.";

  if (Object.keys(errors).length) {
    return res.status(400).json({ error: "Check the highlighted fields.", errors });
  }

  try {
    const pool = await db();
    await pool.query(
      `INSERT INTO registrations (first_name, last_name, phone, email, department, level)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [reg.firstName, reg.lastName, reg.phone, reg.email, reg.department, reg.level]
    );
  } catch (err) {
    if (err && err.code === "23505") {
      return res.status(409).json({
        error: "This email is already registered.",
        errors: { email: "This email is already registered." },
      });
    }
    console.error("register: database error", err);
    return res.status(500).json({ error: "We could not save your registration. Try again in a moment." });
  }

  let emailSent = true;
  try {
    await sendConfirmation(reg);
  } catch (err) {
    emailSent = false;
    console.error("register: email error", err);
  }

  return res.status(201).json({ ok: true, emailSent });
}
