
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data.json');

// Конфигурация ЮKassa (храним здесь, на сервере)
const YOOKASSA_CONFIG = {
  SHOP_ID: '1239556',
  SECRET_KEY: 'live_aIdOO3gb6gqDY-WYy9NpSnmPB0dt-_hJIa0iwNs2Jhg'
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Инициализация БД
if (!fs.existsSync(DB_FILE)) {
  const initialData = { users: [], services: [], bookings: [], jobs: [], transactions: [], messages: [] };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { users: [], services: [], bookings: [], jobs: [], transactions: [], messages: [] };
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- API ЮKassa ---

app.post('/api/create-payment', async (req, res) => {
  const { amount, description, metadata, return_url } = req.body;
  const auth = Buffer.from(`${YOOKASSA_CONFIG.SHOP_ID}:${YOOKASSA_CONFIG.SECRET_KEY}`).toString('base64');
  const idempotencyKey = Math.random().toString(36).substring(2) + Date.now().toString(36);

  try {
    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotencyKey
      },
      body: JSON.stringify({
        amount: { value: amount.toFixed(2), currency: 'RUB' },
        capture: true,
        confirmation: { type: 'redirect', return_url: return_url },
        description: description,
        metadata: metadata
      })
    });

    const data = await response.json();
    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal Server Error', error: e.message });
  }
});

app.get('/api/check-payment/:id', async (req, res) => {
  const paymentId = req.params.id;
  const auth = Buffer.from(`${YOOKASSA_CONFIG.SHOP_ID}:${YOOKASSA_CONFIG.SECRET_KEY}`).toString('base64');

  try {
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      method: 'GET',
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Error checking status' });
  }
});

// --- Остальные API ---

app.get('/api/sync', (req, res) => res.json(readDB()));

app.post('/api/register', (req, res) => {
  const userData = req.body;
  const db = readDB();
  if (db.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return res.status(400).json({ result: 'error', message: 'Email exists' });
  }
  db.users.push(userData);
  saveDB(db);
  res.json({ result: 'success', user: userData });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
