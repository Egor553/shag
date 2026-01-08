
import Dexie, { type Table } from 'dexie';
import { UserSession, Service, Booking, Job, Transaction, ChatMessage, UserRole, MeetingFormat } from '../types';
import { MENTORS, INDUSTRIES } from '../constants';

export class ShagDatabase extends Dexie {
  users!: Table<UserSession & { password?: string }>;
  services!: Table<Service>;
  bookings!: Table<Booking>;
  jobs!: Table<Job>;
  transactions!: Table<Transaction>;
  messages!: Table<ChatMessage>;

  constructor() {
    super('ShagDatabase');
    
    (this as Dexie).version(3).stores({
      users: 'email, id, role, status',
      services: 'id, mentorId, category',
      bookings: 'id, mentorId, userEmail, status, date',
      jobs: 'id, mentorId, status',
      transactions: 'id, userId, date',
      messages: 'id, bookingId, timestamp'
    });
  }
}

export const db = new ShagDatabase();

export async function initDefaultData() {
  try {
    const userCount = await db.users.count();
    if (userCount === 0) {
      console.log('[DB] Настройка элитной экосистемы ШАГ...');
      
      // Системный администратор
      await db.users.put({
        id: 'admin_root',
        email: 'admin',
        name: 'Root Admin',
        password: 'admin123',
        role: UserRole.ADMIN,
        isLoggedIn: false,
        status: 'active',
        balance: 0
      });

      // Наполнение менторами и их услугами
      for (const mentor of MENTORS) {
        await db.users.put({
          ...mentor,
          password: '123',
          status: 'active',
          isLoggedIn: false,
          balance: 0,
          paymentUrl: mentor.avatarUrl, // Используем аватар как фото для витрины
          slots: JSON.stringify({
            "2024-06-15": ["12:00", "14:00", "18:00"],
            "2024-06-16": ["11:00", "15:00"],
            "2024-06-17": ["10:00", "19:00"]
          })
        });

        // Создаем базовый лот для каждого ментора
        const serviceId = `s_${mentor.id}`;
        await db.services.put({
          id: serviceId,
          mentorId: mentor.id,
          mentorName: mentor.name,
          title: `Разбор бизнеса: ${mentor.direction}`,
          description: mentor.description,
          price: mentor.singlePrice,
          groupPrice: mentor.groupPrice,
          format: MeetingFormat.ONLINE_1_ON_1,
          duration: '60 мин',
          category: mentor.industry,
          imageUrl: mentor.avatarUrl,
          slots: JSON.stringify({
            "2024-06-15": ["12:00", "14:00", "18:00"],
            "2024-06-16": ["11:00", "15:00"]
          })
        });
      }

      // Добавим несколько демонстрационных вакансий (миссий)
      await db.jobs.put({
        id: 'j1',
        mentorId: 'm1',
        mentorName: 'Александр Соколовский',
        title: 'Анализ конкурентов в нише EdTech',
        description: 'Нужно собрать таблицу по 20 крупнейшим игрокам рынка, их воронки и офферы. Отличный шанс заглянуть внутрь крупного бизнеса.',
        reward: '7 000 ₽ + Личный отзыв',
        category: 'Маркетинг & Media',
        telegram: '@sokolovsky_team',
        status: 'active',
        createdAt: new Date().toISOString()
      });

      console.log('[DB] Экосистема готова. Менторы и лоты добавлены.');
    }
  } catch (error) {
    console.error('[DB] Критическая ошибка инициализации:', error);
  }
}
