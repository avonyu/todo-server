import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export interface AuthPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice('bearer '.length).trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}