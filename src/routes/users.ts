import { Router } from 'express';
import { requireAuth, AuthRequest } from '@/middleware/auth.js';
import { pool } from '@/db.js';

const router = Router();

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Get me error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;