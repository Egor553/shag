import { Dexie } from 'dexie';
import type { Table } from 'dexie';
import { UserSession, Service, Booking, Job, Transaction, ChatMessage, UserRole, Auction, Bid } from '../types';
import { MENTORS } from '../constants';

export class ShagDatabase extends Dexie {
  users!: Table<UserSession & { password?: string }>;
  services!: Table<Service>;
  bookings!: Table<Booking>;
  jobs!: Table<Job>;
  transactions!: Table<Transaction>;
  messages!: Table<ChatMessage>;
  auctions!: Table<Auction>;
  bids!: Table<Bid>;

  constructor() {
    super('ShagDatabase');
    
    (this as Dexie).version(10).stores({
      users: 'email, id, role, status',
      services: 'id, mentorId, category',
      bookings: 'id, mentorId, userEmail, status, date',
      jobs: 'id, mentorId, status',
      transactions: 'id, userId, date',
      messages: 'id, bookingId, timestamp',
      auctions: 'id, mentorId, serviceId',
      bids: 'id, auctionId, userId'
    });
  }
}

export const db = new ShagDatabase();

export async function initDefaultData() {
  try {
    // 1. Всегда проверяем и создаем админа, если его нет
    const adminEmail = 'admin';
    const existingAdmin = await db.users.get(adminEmail);
    
    if (!existingAdmin) {
      console.log('[БД] Создание Root Администратора...');
      await db.users.put({
        id: 'admin_root',
        email: adminEmail,
        name: 'Администратор ШАГ',
        password: 'admin123',
        role: UserRole.ADMIN,
        isLoggedIn: false,
        status: 'active',
        balance: 1000000,
        direction: 'Управление платформой',
        city: 'Москва',
        createdAt: new Date().toISOString()
      });
    }

    // 2. Инициализируем демо-менторов только если база пуста (кроме админа)
    const userCount = await db.users.count();
    if (userCount <= 1) {
      console.log('[БД] Загрузка начальных менторов...');
      for (const mentor of MENTORS) {
        await db.users.put({
          ...mentor,
          password: '123',
          status: 'active',
          isLoggedIn: false,
          balance: 0,
          paymentUrl: mentor.avatarUrl,
          createdAt: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('[БД] Ошибка инициализации:', error);
  }
}