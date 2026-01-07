
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data.json');

// Конфигурация ЮKassa (Рекомендуется в будущем вынести в process.env)
const YOOKASSA_CONFIG = {
  SHOP_ID: '1239556',
  SECRET_KEY: 'live_aIdOO3gb6gqDY-WYy9NpSnmPB0dt-_hJIa0iwNs2Jhg'
};

app.use(cors());
app.use(bodyParser.json());

// Раздача статических файлов (index.html, index.tsx и т.д.)
app.use(express.static(__dirname));

// --- API Базы данных ---
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = { users: [], services: [], bookings: [], jobs: [], transactions: [], messages: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { users: [], services: [], bookings: [], jobs: [], transactions: [], messages: [] };
  }
};

const saveDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// --- API Платежей ---
app.post('/api/create-payment', async (req, res) => {
  const { amount, description, metadata, return_url } = req.body;
  const auth = Buffer.from(`${YOOKASSA_CONFIG.SHOP_ID}:${YOOKASSA_CONFIG.SECRET_KEY}`).toString('base64');
  
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
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/check-payment/:id', async (req, res) => {
  const auth = Buffer.from(`${YOOKASSA_CONFIG.SHOP_ID}:${YOOKASSA_CONFIG.SECRET_KEY}`).toString('base64');
  try {
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${req.params.id}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/sync', (req, res) => res.json(readDB()));

app.post('/api/register', (req, res) => {
  const db = readDB();
  const userData = req.body;
  const index = db.users.findIndex(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (index === -1) {
    db.users.push(userData);
    saveDB(db);
    res.json({ result: 'success', user: userData });
  } else {
    res.status(400).json({ result: 'error', message: 'Пользователь уже существует' });
  }
});

app.post('/api/save-booking', (req, res) => {
  const db = readDB();
  db.bookings.push(req.body);
  saveDB(db);
  res.json({ result: 'success' });
});

app.post('/api/update-profile', (req, res) => {
  const db = readDB();
  const { email, updates } = req.body;
  const index = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...updates };
    saveDB(db);
    res.json({ result: 'success' });
  } else {
    res.status(404).json({ result: 'error' });
  }
});

// Все остальные запросы отдают index.html (для React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
