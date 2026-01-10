import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Метод запрещен' });
  // Имитация сохранения
  return res.status(200).json({ result: 'success' });
}