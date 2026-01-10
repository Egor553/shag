
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
    
    // Fix: Using this.version to define the Dexie schema. Named imports ensure methods like version are correctly typed.
    this.version(8).stores({
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
    // Проверяем наличие админа при каждом запуске
    const adminExists = await db.users.get('admin');
    
    if (!adminExists) {
      console.log('[DB] Инициализация Root-доступа...');
      await db.users.put({
        id: 'admin_root',
        email: 'admin',
        name: 'Root Admin',
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

    // Заполняем менторов, если база пуста
    const userCount = await db.users.count();
    if (userCount <= 1) { // Если только админ
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
    console.error('[DB] Ошибка инициализации:', error);
  }
}
