import { Client } from 'pg';

const url = process.env.POSTGRES_URL || 'postgres://postgres:pass@localhost:5432/postgres';

async function run() {
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query(`CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    titre TEXT NOT NULL,
    fait BOOLEAN DEFAULT false,
    owner TEXT,
    created_at TIMESTAMP DEFAULT now()
  )`);
  await client.query(`ALTER TABLE todos ADD COLUMN IF NOT EXISTS owner TEXT`);
  const res = await client.query('INSERT INTO todos (titre, owner) VALUES ($1, $2) RETURNING id, titre, fait', ['Seed PG test', 'seed-user']);
  console.log('Inserted into Postgres:', res.rows[0]);
  await client.end();
}

run().catch(err => {
  console.error('Postgres seed failed:', err.message || err);
  process.exit(1);
});
