import type { VercelRequest, VercelResponse } from '@vercel/node';

const SHOP_ID = '1239556';
const SECRET_KEY = 'live_aIdOO3gb6gqDY-WYy9NpSnmPB0dt-_hJIa0iwNs2Jhg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  // Fix: Use btoa to avoid 'Buffer' not found error in TypeScript environment without Node types
  const auth = btoa(`${SHOP_ID}:${SECRET_KEY}`);

  try {
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${id}`, {
      headers: { 'Authorization': `Basic ${auth}` }
    });
    const data = await response.json();
    return res.json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}