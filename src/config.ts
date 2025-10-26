import dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT || "3000", 10);
export const JWT_SECRET = process.env.JWT_SECRET || "123456";

// Prefer DATABASE_URL; fallback to POSTGRES_URL for convenience
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://avon:123456@localhost:5432/todo_app";
