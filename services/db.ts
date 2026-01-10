
import Dexie, { type Table } from 'dexie';
import { UserSession, Service, Booking, Job, Transaction, ChatMessage, UserRole, Auction, Bid } from '../types';
import { MENTORS } from '../constants';

export class ShagDatabase extends Dexie {
  users!: Table<UserSession & { password?: string }>;
  services!: Table<Service>;
  bookings!: Table<Booking>;
  jobs!: Table<Job>;
  transactions!: Table<Transaction>;
  messages!: Table<ChatMessage>;
  // Added auctions and bids tables to support auction functionality
  auctions!: Table<Auction>;
  bids!: Table<Bid>;

  constructor() {
    super('ShagDatabase');
    
    // Bumped version to 8 to include new tables in the schema
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
    const userCount = await db.users.count();
    if (userCount === 0) {
      console.log('[DB] Настройка чистой экосистемы ШАГ...');
      
      // Создаем только Root Admin
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
        slots: JSON.stringify({
          "2024-06-20": ["12:00", "15:00"],
          "2024-06-21": ["10:00", "18:00"]
        })
      });

      // Регистрируем менторов из констант (только профили)
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

      console.log('[DB] Экосистема готова. Контент создается пользователями и Админом.');
    }
  } catch (error) {
    console.error('[DB] Ошибка инициализации:', error);
  }
}
