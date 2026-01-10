import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  try {
    const userData = req.body;
    
    // В реальном приложении здесь должен быть запрос к базе данных (Postgres/Supabase)
    // Например: await sql`INSERT INTO users ...`
    
    // Для прототипа на Vercel мы имитируем успешный ответ, 
    // чтобы клиентское приложение сохранило данные в локальную Dexie
    return res.status(200).json({ 
      result: 'success', 
      user: {
        ...userData,
        status: userData.role === 'entrepreneur' ? 'pending' : 'active',
        createdAt: new Date().toISOString()
      }
    });
  } catch (e: any) {
    return res.status(500).json({ result: 'error', message: e.message });
  }
}