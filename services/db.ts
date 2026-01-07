import { Dexie, type Table } from 'dexie';
import { UserSession, Service, Booking, Job, Transaction, ChatMessage, UserRole } from '../types';
import { MENTORS } from '../constants';

/**
 * SHAG Embedded Database (IndexedDB)
 */
export class ShagDatabase extends Dexie {
  users!: Table<UserSession & { password?: string }>;
  services!: Table<Service>;
  bookings!: Table<Booking>;
  jobs!: Table<Job>;
  transactions!: Table<Transaction>;
  messages!: Table<ChatMessage>;

  constructor() {
    // Calling super with the database name
    super('ShagDatabase');
    // Define the schema. Fix: Ensuring 'version' method is correctly typed by using named import for Dexie.
    this.version(1).stores({
      users: '++id, email, role, status',
      services: '++id, mentorId, category',
      bookings: '++id, mentorId, userEmail, status, date',
      jobs: '++id, mentorId, status',
      transactions: '++id, userId, date',
      messages: '++id, bookingId, timestamp'
    });
  }
}

export const db = new ShagDatabase();

/**
 * Инициализация начальных данных
 */
export async function initDefaultData() {
  const userCount = await db.users.count();
  if (userCount === 0) {
    console.log('[DB] Initializing default data...');
    
    // Добавляем админа
    await db.users.add({
      id: 'admin_root',
      email: 'admin',
      name: 'Root Admin',
      password: 'admin123',
      role: UserRole.ADMIN,
      isLoggedIn: false,
      status: 'active'
    });

    // Добавляем предустановленных менторов
    for (const mentor of MENTORS) {
      await db.users.add({
        ...mentor,
        password: '123',
        status: 'active',
        isLoggedIn: false
      });
    }
    
    console.log('[DB] Default data initialized');
  }
}
