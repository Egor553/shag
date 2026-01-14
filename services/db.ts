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
    super('ShagDatabaseV2'); // Изменили имя базы на V2, чтобы избежать конфликтов со старой версией

    this.version(1).stores({
      users: 'email, id, role',
      services: 'id, mentorId',
      bookings: 'id, userEmail',
      jobs: 'id',
      transactions: 'id, userId',
      messages: 'id, bookingId',
      auctions: 'id',
      bids: 'id, auctionId'
    });
  }
}

export const db = new ShagDatabase();

// Глобальный перехват ошибок открытия БД
db.on('versionchange', () => {
  db.close();
  window.location.reload();
});

export async function initDefaultData() {
  try {
    const userCount = await db.users.count();
    if (userCount === 0) {
      console.log('[БД] Инициализация начальных данных...');
      // Добавляем менторов как начальных пользователей
      for (const mentor of MENTORS) {
        await db.users.put({
          ...mentor,
          password: '123',
          status: 'active',
          isLoggedIn: false,
          balance: 0,
          createdAt: new Date().toISOString()
        } as any);
      }
    }
  } catch (error) {
    console.error('[БД] Ошибка:', error);
    // Если критическая ошибка - пробуем удалить базу и перезагрузить
    if (error.name === 'UpgradeError') {
      await Dexie.delete('ShagDatabase');
      await Dexie.delete('ShagDatabaseV2');
      window.location.reload();
    }
  }
}