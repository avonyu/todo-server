import { Pool } from 'pg';
import { DATABASE_URL } from './config';

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export async function initDb(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create todos table
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database initialization failed:', err);
    throw err;
  } finally {
    client.release();
  }
}