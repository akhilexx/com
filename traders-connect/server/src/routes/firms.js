import { Router } from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'secretkey';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/', authMiddleware, (req, res) => {
  const { name, email, website, rules } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing fields' });
  const stmt = db.prepare(
    'INSERT INTO firms (name, email, website, rules) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(name, email || '', website || '', rules || '');
  res.json({ id: info.lastInsertRowid });
});

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT id, name, website, approved FROM firms WHERE approved = 1').all();
  res.json(rows);
});

export default router;
