import "dotenv/config";

export const config = {
  databaseUrl: process.env.DATABASE_URL || "",
  dbSsl: process.env.DB_SSL !== "false",
  jwtSecret: process.env.JWT_SECRET || process.env.ADMIN_SECRET || "discovery-secret-key",
  adminEmail:
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_USERNAME ||
    process.env.GMAIL_USER ||
    "",
  adminUsername:
    process.env.ADMIN_USERNAME ||
    process.env.ADMIN_EMAIL ||
    process.env.GMAIL_USER ||
    "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  mail: {
    user: process.env.GMAIL_USER || process.env.SMTP_USER || "",
    appPassword: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "",
    fromName: process.env.MAIL_FROM_NAME || "Interswitch x LCU",
  },
};

export default config;