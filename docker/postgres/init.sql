-- Initialize database for todo_app
-- This script runs automatically on first container startup

-- Create application user (separate from default superuser)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'avon'
  ) THEN
    CREATE ROLE avon LOGIN PASSWORD '123456';
  END IF;
END
$$;

-- Ensure privileges for avon on public schema
GRANT USAGE ON SCHEMA public TO avon;
GRANT CREATE ON SCHEMA public TO avon;

-- Tables (match server expectations; harmless if app also creates with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Grants for avon on current and future tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO avon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO avon;

-- Optional seed examples (uncomment to seed)
-- INSERT INTO users (id, email, password_hash, name)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'demo@example.com',
--   '$2a$10$wQWk4f8mHuE0R9uE8Yb1IeV58yT1uC7Q5YB8i7mV6wR0YQ8Hn1uQ6', -- bcrypt for 'password123'
--   'Demo User');
-- INSERT INTO todos (id, user_id, title, description)
-- VALUES ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001',
--   'First Todo', 'Try the API with this seeded todo');