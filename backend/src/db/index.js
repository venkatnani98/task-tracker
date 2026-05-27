const { Pool } = require('pg');

// Pool manages a set of reusable DB connections (more efficient than
// opening a new connection for every query)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Run once on startup: creates the table if it doesn't already exist.
// SERIAL = auto-incrementing integer primary key
// TIMESTAMP WITH TIME ZONE = stores timezone-aware timestamps
const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id           SERIAL PRIMARY KEY,
      title        VARCHAR(255) NOT NULL,
      description  TEXT         NOT NULL DEFAULT '',
      status       VARCHAR(20)  NOT NULL DEFAULT 'pending',
      created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
};

module.exports = { pool, initDb };