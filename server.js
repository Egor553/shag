import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Config
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID || '1239556';
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY || 'live_aIdOO3gb6gqDY-WYy9NpSnmPB0dt-_hJIa0iwNs2Jhg';

// Database Setup
const dbPath = path.resolve(__dirname, 'shag.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening database:', err.message);
  else console.log('Connected to SQLite database.');
});

// Initialize Tables & Admin
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    service_id TEXT,
    date TEXT,
    time TEXT,
    status TEXT DEFAULT 'pending', 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    amount REAL,
    currency TEXT,
    status TEXT,
    description TEXT,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create Admin if not exists
  db.get("SELECT * FROM users WHERE email = 'admin'", (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (email, password, name, role) VALUES ('admin', 'admin123', 'Администратор', 'admin')");
      console.log("Admin account created: admin / admin123");
    }
  });
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// --- API Платежей ---
app.post('/api/create-payment', async (req, res) => {
  const { amount, description, metadata, return_url } = req.body;
  const auth = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64');

  try {
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': Date.now().toString()
      },
      body: JSON.stringify({
        amount: { value: Number(amount).toFixed(2), currency: 'RUB' },
        capture: true,
        confirmation: { type: 'redirect', return_url: return_url },
        description: description,
        metadata: metadata
      })
    });

    const data = await response.json();

    if (data.id) {
      const stmt = db.prepare("INSERT INTO transactions (id, amount, currency, status, description, metadata) VALUES (?, ?, ?, ?, ?, ?)");
      stmt.run(data.id, data.amount.value, data.amount.currency, data.status, description, JSON.stringify(metadata));
      stmt.finalize();
    }

    res.status(response.status).json(data);
  } catch (e) {
    console.error('Payment Error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/check-payment/:id', async (req, res) => {
  const auth = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64');
  try {
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${req.params.id}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const data = await response.json();

    if (data.id && data.status) {
      db.run("UPDATE transactions SET status = ? WHERE id = ?", [data.status, data.id]);
    }

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API Пользователей ---

// Логин
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      res.json({ result: 'success', user: row });
    } else {
      res.status(401).json({ result: 'error', message: 'Неверный логин или пароль' });
    }
  });
});

// Регистрация
app.post('/api/register', (req, res) => {
  const { email, password, name } = req.body; // Removed 'role' from input for security

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(400).json({ result: 'error', message: 'Пользователь уже существует' });

    const stmt = db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, 'user')");
    stmt.run(email, password, name, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ result: 'success', user: { id: this.lastID, email, name, role: 'user' } });
    });
    stmt.finalize();
  });
});

// --- API Бронирований ---
app.post('/api/save-booking', (req, res) => {
  const { user_email, service_id, date, time } = req.body;
  const stmt = db.prepare("INSERT INTO bookings (user_email, service_id, date, time) VALUES (?, ?, ?, ?)");
  stmt.run(user_email, service_id, date, time, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ result: 'success' });
  });
  stmt.finalize();
});

// --- Sync (Админка) ---
app.get('/api/sync', (req, res) => {
  db.all("SELECT * FROM users", [], (err, users) => {
    if (err) return res.status(500).json({ error: err });
    db.all("SELECT * FROM bookings", [], (err, bookings) => {
      db.all("SELECT * FROM transactions", [], (err, transactions) => {
        res.json({ users, bookings, transactions });
      });
    });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.VITE_DEV_SERVER !== 'true') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
