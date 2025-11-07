import { Client } from 'pg';

let _client = null;

export async function connect(connectionString) {
  if (!connectionString) {
    console.warn('POSTGRES_URL not set - skipping Postgres connection');
    return null;
  }
  _client = new Client({ connectionString });
  await _client.connect();
  console.log('Postgres connected');
  await _client.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      titre TEXT NOT NULL,
      fait BOOLEAN DEFAULT false,
      owner TEXT,
      created_at TIMESTAMP DEFAULT now()
    )
  `);
  // Ensure owner column exists for existing schemas
  await _client.query(`ALTER TABLE todos ADD COLUMN IF NOT EXISTS owner TEXT`);
  return _client;
}

export const client = () => _client;
