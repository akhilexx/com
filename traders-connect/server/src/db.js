import Database from 'better-sqlite3';

const db = new Database('data.sqlite');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  name TEXT
);
CREATE TABLE IF NOT EXISTS firms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  website TEXT,
  rules TEXT,
  approved INTEGER DEFAULT 0
);
`);

export default db;
