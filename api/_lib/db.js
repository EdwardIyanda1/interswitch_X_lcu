import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing in environment variables.');
}

const useSsl =
  process.env.DB_SSL !== 'false' &&
  (connectionString.includes('render.com') ||
    process.env.NODE_ENV === 'production' ||
    process.env.DB_SSL === 'true');

export const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export function getPool() {
  return pool;
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    matric_number TEXT,
    department TEXT,
    faculty TEXT,
    level TEXT,
    gender TEXT,
    track TEXT,
    role TEXT,
    interest TEXT,
    expectations TEXT,
    consent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );
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

export default {
  pool,
  getPool,
  query,
  ensureDatabaseInitialized,
};