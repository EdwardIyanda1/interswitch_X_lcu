import 'dotenv/config';
import nodemailer from 'nodemailer';
import { config } from './config.js';

let transporter;

export function getTransporter() {
  if (!transporter) {
    if (!config.mail.user || !config.mail.appPassword) {
      throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required.');
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mail.user,
        pass: config.mail.appPassword,
      },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  const mailTransporter = getTransporter();
  const senderAddress = config.mail.fromName
    ? `"${config.mail.fromName}" <${config.mail.user}>`
    : config.mail.user;

  return mailTransporter.sendMail({
    from: senderAddress,
    to,
    subject,
    text,
    html,
  });
}