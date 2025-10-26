import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT || '3000', 10);
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Prefer DATABASE_URL; fallback to POSTGRES_URL for convenience
export const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/todo_app';