import { Router } from 'express';
import { pool } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { randomUUID } from 'crypto';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const userId = randomUUID();

    await pool.query(
      'INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)',
      [userId, normalizedEmail, passwordHash, name || null]
    );

    const token = jwt.sign({ id: userId, email: normalizedEmail }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const normalizedEmail = String(email).toLowerCase().trim();

    const result = await pool.query('SELECT id, password_hash FROM users WHERE email = $1', [normalizedEmail]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { id, password_hash } = result.rows[0];
    const ok = await bcrypt.compare(String(password), password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id, email: normalizedEmail }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;