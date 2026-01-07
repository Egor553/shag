
import { Dexie, type Table } from 'dexie';
import { UserSession, Service, Booking, Job, Transaction, ChatMessage, UserRole } from '../types';
import { MENTORS } from '../constants';

export class ShagDatabase extends Dexie {
  users!: Table<UserSession & { password?: string }>;
  services!: Table<Service>;
  bookings!: Table<Booking>;
  jobs!: Table<Job>;
  transactions!: Table<Transaction>;
  messages!: Table<ChatMessage>;

  constructor() {
    super('ShagDatabase');
    // Обновляем схему: email теперь главный ключ для users
    this.version(2).stores({
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
      console.log('[DB] Первичная настройка системы...');
      
      // Админ
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

      // Базовые менторы
      for (const mentor of MENTORS) {
        await db.users.put({
          ...mentor,
          password: '123',
          status: 'active',
          isLoggedIn: false,
          balance: 0
        });
      }
      console.log('[DB] Данные успешно инициализированы');
    }
  } catch (error) {
    console.error('[DB] Ошибка инициализации:', error);
  }
}
