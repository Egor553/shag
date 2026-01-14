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
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // КРИТИЧЕСКИ ВАЖНО для Vercel/Neon
  }
});

// Initialize Tables & Admin
const initDB = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        city TEXT,
        phone TEXT,
        birth_date TEXT,
        company_name TEXT,
        turnover TEXT,
        direction TEXT,
        qualities TEXT,
        request_to_youth TEXT,
        focus_goal TEXT,
        expectations TEXT,
        mutual_help TEXT,
        time_limit TEXT,
        slots TEXT,
        business_clubs TEXT,
        lifestyle TEXT,
        status TEXT DEFAULT 'active',
        experience TEXT,
        description TEXT,
        achievements TEXT,
        single_price REAL DEFAULT 0,
        group_price REAL DEFAULT 0,
        avatar_url TEXT,
        video_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // Добавляем недостающие колонки если таблица уже создана
      const columns = [
        ['city', 'TEXT'], ['phone', 'TEXT'], ['birth_date', 'TEXT'],
        ['company_name', 'TEXT'], ['turnover', 'TEXT'], ['direction', 'TEXT'],
        ['qualities', 'TEXT'], ['request_to_youth', 'TEXT'], ['focus_goal', 'TEXT'],
        ['expectations', 'TEXT'], ['mutual_help', 'TEXT'], ['time_limit', 'TEXT'],
        ['slots', 'TEXT'], ['business_clubs', 'TEXT'], ['lifestyle', 'TEXT'],
        ['status', 'TEXT'], ['experience', 'TEXT'], ['description', 'TEXT'],
        ['achievements', 'TEXT'], ['single_price', 'REAL'], ['group_price', 'REAL'],
        ['avatar_url', 'TEXT'], ['video_url', 'TEXT']
      ];

      for (const [col, type] of columns) {
        try {
          await client.query(`ALTER TABLE users ADD COLUMN ${col} ${type}`);
        } catch (e) { /* Игнорируем если колонка уже есть */ }
      }

      await client.query(`CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_email TEXT,
        service_id TEXT,
        date TEXT,
        time TEXT,
        status TEXT DEFAULT 'pending', 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      await client.query(`CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount REAL,
        currency TEXT,
        status TEXT,
        description TEXT,
        metadata TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      await client.query(`CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        mentor_id TEXT NOT NULL,
        user_email TEXT,
        user_name TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

      // Create Admin if not exists
      const adminCheck = await client.query("SELECT * FROM users WHERE email = $1", ['admin']);
      if (adminCheck.rows.length === 0) {
        await client.query(
          "INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)",
          ['admin', 'admin123', 'Администратор', 'admin']
        );
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("DB Background Init Error:", err.message);
  }
};

// Запускаем инициализацию сразу
initDB();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Helper for mapping snake_case from DB to camelCase for Frontend
const toCamel = (obj) => {
  if (!obj) return obj;
  const newObj = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj;
};

// --- API Пользователей ---

// Логин
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  // ЭКСТРЕННЫЙ ВХОД ДЛЯ АДМИНА
  if (email === 'admin' && password === 'admin123') {
    const dummyAdmin = { id: 0, email: 'admin', name: 'Администратор', role: 'admin' };
    try {
      await pool.query("INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING", ['admin', 'admin123', 'Администратор', 'admin']);
    } catch (e) { }
    return res.json({ result: 'success', user: dummyAdmin });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    if (result.rows.length > 0) {
      res.json({ result: 'success', user: toCamel(result.rows[0]) });
    } else {
      res.status(401).json({ result: 'error', message: 'Неверный логин или пароль' });
    }
  } catch (e) {
    await initDB();
    res.status(500).json({ error: e.message });
  }
};

app.post('/api/login', handleLogin);
app.post('/api/вход-в-систему', handleLogin); // Алиас
app.post('/api/вход-всистему', handleLogin); // Алиас без дефиса (как на скрине)

// Регистрация
const handleRegister = async (req, res) => {
  const {
    email, password, name, role, city, phone, birthDate,
    companyName, turnover, direction, qualities, requestToYouth,
    focusGoal, expectations, mutualHelp, timeLimit, slots,
    businessClubs, lifestyle, status, experience, description,
    achievements, singlePrice, groupPrice, avatarUrl, videoUrl
  } = req.body;

  try {
    const check = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ result: 'error', message: 'Пользователь уже существует' });
    }

    const insert = await pool.query(
      `INSERT INTO users (
        email, password, name, role, city, phone, birth_date,
        company_name, turnover, direction, qualities, request_to_youth,
        focus_goal, expectations, mutual_help, time_limit, slots,
        business_clubs, lifestyle, status, experience, description,
        achievements, single_price, group_price, avatar_url, video_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) 
      RETURNING *`,
      [
        email, password, name, role || 'user', city, phone, birthDate,
        companyName, turnover, direction, qualities, requestToYouth,
        focusGoal, expectations, mutualHelp, timeLimit, slots,
        businessClubs, lifestyle, status || 'active', experience, description,
        Array.isArray(achievements) ? JSON.stringify(achievements) : achievements,
        singlePrice || 0, groupPrice || 0, avatarUrl, videoUrl
      ]
    );
    res.json({ result: 'success', user: toCamel(insert.rows[0]) });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(500).json({ error: e.message });
  }
};

app.post('/api/register', handleRegister);
app.post('/api/зарегистрироваться', handleRegister); // Алиас

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
      await pool.query(
        "INSERT INTO transactions (id, amount, currency, status, description, metadata) VALUES ($1, $2, $3, $4, $5, $6)",
        [data.id, data.amount.value, data.amount.currency, data.status, description, JSON.stringify(metadata)]
      );
    }
    res.status(response.status).json(data);
  } catch (e) {
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
      await pool.query("UPDATE transactions SET status = $1 WHERE id = $2", [data.status, data.id]);
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

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

app.get('/api/sync', async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    const bookings = await pool.query("SELECT * FROM bookings");
    const transactions = await pool.query("SELECT * FROM transactions");
    const reviews = await pool.query("SELECT * FROM reviews");
    res.json({
      users: users.rows.map(toCamel),
      bookings: bookings.rows.map(toCamel),
      transactions: transactions.rows.map(toCamel),
      reviews: reviews.rows.map(toCamel)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API Отзывов ---
app.post('/api/save-review', async (req, res) => {
  const { mentor_id, user_email, user_name, rating, comment, is_anonymous } = req.body;
  try {
    await pool.query(
      "INSERT INTO reviews (mentor_id, user_email, user_name, rating, comment, is_anonymous) VALUES ($1, $2, $3, $4, $5, $6)",
      [mentor_id, user_email, is_anonymous ? 'Аноним' : user_name, rating, comment, is_anonymous]
    );
    res.json({ result: 'success' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/reviews/:mentorId', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reviews WHERE mentor_id = $1 ORDER BY created_at DESC", [req.params.mentorId]);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- API Статуса Бронирования ---
app.patch('/api/bookings/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ result: 'success' });
  } catch (e) {
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
