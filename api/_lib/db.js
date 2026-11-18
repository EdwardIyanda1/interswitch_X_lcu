import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const connectionString = (process.env.DATABASE_URL || "").trim();

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env");
}

const useSsl =
  process.env.DB_SSL !== "false" &&
  (connectionString.includes("render.com") ||
    process.env.NODE_ENV === "production" ||
    process.env.DB_SSL === "true");

export const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

export function getPool() {
  return pool;
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    second_name TEXT,
    full_name TEXT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    matric_number TEXT,
    department TEXT,
    faculty TEXT,
    level TEXT,
    hackathon_participation TEXT,
    focus_area TEXT,
    track TEXT,
    consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );

  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS first_name TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS second_name TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS full_name TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS name TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS phone TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS matric_number TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS department TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS level TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS hackathon_participation TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS focus_area TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS track TEXT;
  ALTER TABLE registrations ADD COLUMN IF NOT EXISTS consent BOOLEAN DEFAULT TRUE;

  CREATE OR REPLACE FUNCTION notify_registration_change()
  RETURNS trigger AS $$
  BEGIN
    PERFORM pg_notify('registrations_channel', row_to_json(NEW)::text);
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS trg_registrations_notify ON registrations;
  CREATE TRIGGER trg_registrations_notify
  AFTER INSERT OR UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_registration_change();
`;

let initializedPromise = null;

export function ensureDatabaseInitialized() {
  if (!initializedPromise) {
    initializedPromise = pool.query(SCHEMA_SQL).catch((err) => {
      initializedPromise = null;
      throw err;
    });
  }
  return initializedPromise;
}

export async function query(text, params) {
  await ensureDatabaseInitialized();
  return pool.query(text, params);
}

export const db = {
  pool,
  query,
  getPool,
  init: ensureDatabaseInitialized,
  ensureDatabaseInitialized,
  connect: async () => {
    await ensureDatabaseInitialized();
    return pool.connect();
  },
};

export default db;