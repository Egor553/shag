import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Config YooKassa
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID || '1239556';
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY || 'live_aIdOO3gb6gqDY-WYy9NpSnmPB0dt-_hJIa0iwNs2Jhg';

// Database Setup (PostgreSQL)
// Vercel Postgres automatically provides POSTGRES_URL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize Tables & Admin
const initDB = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connection successful");
    try {
      // Create Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Bookings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          user_email TEXT,
          service_id TEXT,
          date TEXT,
          time TEXT,
          status TEXT DEFAULT 'pending', 
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Transactions table
      await client.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          amount REAL,
          currency TEXT,
          status TEXT,
          description TEXT,
          metadata TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Admin account if it doesn't exist
      const adminCheck = await client.query("SELECT * FROM users WHERE email = $1", ['admin']);
      if (adminCheck.rows.length === 0) {
        await client.query(
          "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)",
          ['admin', 'admin123', 'Администратор', 'admin']
        );
        console.log("Admin account created: admin / admin123");
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("DB Initialization Error (Make sure POSTGRES_URL is set):", err.message);
  }
};

initDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// --- API Платежей (ЮKassa) ---
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
      try {
        await pool.query(
          "INSERT INTO transactions (id, amount, currency, status, description, metadata) VALUES ($1, $2, $3, $4, $5, $6)",
          [data.id, data.amount.value, data.amount.currency, data.status, description, JSON.stringify(metadata)]
        );
      } catch (e) { console.error("Transaction Logging Error:", e); }
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
      try {
        await pool.query("UPDATE transactions SET status = $1 WHERE id = $2", [data.status, data.id]);
      } catch (e) { console.error("Transaction Update Error:", e); }
    }

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API Пользователей ---

// Логин
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    if (result.rows.length > 0) {
      res.json({ result: 'success', user: result.rows[0] });
    } else {
      res.status(401).json({ result: 'error', message: 'Неверный логин или пароль' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Регистрация
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const check = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ result: 'error', message: 'Пользователь уже существует' });
    }

    const insert = await pool.query(
      "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, 'user') RETURNING id, email, name, role",
      [email, password, name]
    );

    res.json({ result: 'success', user: insert.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API Бронирований ---
app.post('/api/save-booking', async (req, res) => {
  const { user_email, service_id, date, time } = req.body;
  try {
    await pool.query(
      "INSERT INTO bookings (user_email, service_id, date, time) VALUES ($1, $2, $3, $4)",
      [user_email, service_id, date, time]
    );
    res.json({ result: 'success' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Sync (Админка) ---
app.get('/api/sync', async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    const bookings = await pool.query("SELECT * FROM bookings");
    const transactions = await pool.query("SELECT * FROM transactions");
    res.json({
      users: users.rows,
      bookings: bookings.rows,
      transactions: transactions.rows
    });
  } catch (e) {
    console.error("Sync Error:", e);
    res.status(500).json({ error: e.message });
  }
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
