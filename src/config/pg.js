const { Client } = require('pg');

let client = null;

async function connect(connectionString) {
  if (!connectionString) {
    console.warn('POSTGRES_URL not set - skipping Postgres connection');
    return null;
  }
  client = new Client({ connectionString });
  await client.connect();
  console.log('Postgres connected');
  // ensure table exists
  await client.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      titre TEXT NOT NULL,
      fait BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT now()
    )
  `);
  return client;
}

module.exports = { connect, client: () => client };
