import { Router } from 'express';
import { requireAuth, AuthRequest } from '@/middleware/auth.js';
import { pool } from '@/db.js';
import { randomUUID } from 'crypto';

const router = Router();

// List todos for current user
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const result = await pool.query(
      'SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('List todos error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new todo
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { title, description } = req.body || {};
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const id = randomUUID();
    const result = await pool.query(
      'INSERT INTO todos (id, user_id, title, description) VALUES ($1, $2, $3, $4) RETURNING id, title, description, completed, created_at, updated_at',
      [id, userId, title, description || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create todo error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single todo
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, title, description, completed, created_at, updated_at FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Get todo error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a todo
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { title, description, completed } = req.body || {};

    const result = await pool.query(
      `UPDATE todos SET title = COALESCE($1, title), description = COALESCE($2, description), completed = COALESCE($3, completed), updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING id, title, description, completed, created_at, updated_at`,
      [title ?? null, description ?? null, completed ?? null, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Update todo error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a todo
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2', [id, userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Delete todo error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;