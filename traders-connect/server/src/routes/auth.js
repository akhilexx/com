import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = Router();
const SECRET = process.env.JWT_SECRET || 'secretkey';

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  const existing = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email);
  if (existing) return res.status(400).json({ error: 'Email taken' });

  const hashed = await bcrypt.hash(password, 10);
  const stmt = db.prepare(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)'
  );
  const info = stmt.run(email, hashed, name || '');
  res.json({ id: info.lastInsertRowid });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

export default router;
