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
    
    // Fix: Explicitly cast 'this' to 'Dexie' to resolve type inference issues where the inherited 'version' method was not found
    (this as Dexie).version(8).stores({
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
    const adminExists = await db.users.get('admin');
    
    if (!adminExists) {
      console.log('[БД] Инициализация Главного Администратора...');
      await db.users.put({
        id: 'admin_root',
        email: 'admin',
        name: 'Главный Администратор',
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

    const userCount = await db.users.count();
    if (userCount <= 1) {
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
