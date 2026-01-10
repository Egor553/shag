import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  try {
    // В реальном приложении: const data = await sql`SELECT * FROM ...`
    // Пока БД не подключена, отдаем пустые массивы или начальных менторов
    return res.status(200).json({ 
      users: [], 
      services: [], 
      bookings: [], 
      jobs: [], 
      transactions: [],
      auctions: [],
      bids: []
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}