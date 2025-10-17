// seeds Postgres with a test todo
const { Client } = require('pg');

const url = process.env.POSTGRES_URL || 'postgres://postgres:pass@localhost:5432/postgres';

async function run() {
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query(`CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    titre TEXT NOT NULL,
    fait BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now()
  )`);
  const res = await client.query('INSERT INTO todos (titre) VALUES ($1) RETURNING id, titre, fait', ['Seed PG test']);
  console.log('Inserted into Postgres:', res.rows[0]);
  await client.end();
}

run().catch(err => {
  console.error('Postgres seed failed:', err.message || err);
  process.exit(1);
});
