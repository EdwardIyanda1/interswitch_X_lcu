import "dotenv/config";
import nodemailer from "nodemailer";

let transporter = null;

export function getTransporter() {
  if (!transporter) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      return null;
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) {
    return null;
  }

  const fromName = process.env.MAIL_FROM_NAME || "Interswitch x LCU";
  const fromEmail = process.env.GMAIL_USER;

  return mailTransporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  });
}

export default {
  getTransporter,
  sendMail,
};