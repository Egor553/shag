
import { UserSession, Booking, ChatMessage, Service, Job, Transaction, UserRole } from '../types';
import { db, initDefaultData } from './db';

const logDB = (op: string, data?: any) => {
  console.log(`%c[Embedded DB] ${op}`, 'color: #10b981; font-weight: bold;', data || '');
};

// Инициализируем БД при загрузке
initDefaultData().catch(console.error);

export const dbService = {
  async login(credentials: { email: string; password: string }) {
    const email = credentials.email.trim().toLowerCase();
    logDB('LOGIN ATTEMPT', email);
    
    const user = await db.users.where('email').equalsIgnoreCase(email).first();

    if (!user || String(user.password) !== credentials.password) {
      throw new Error('Неверный логин или пароль');
    }
    
    return { ...user, isLoggedIn: true } as UserSession;
  },

  async register(userData: any): Promise<{ result: string; user: any; message?: string }> {
    try {
      logDB('REGISTER USER', userData.email);
      const existing = await db.users.where('email').equalsIgnoreCase(userData.email).first();
      if (existing) return { result: 'error', user: null, message: 'Пользователь с таким email уже существует' };

      const data = { 
        ...userData, 
        createdAt: new Date().toISOString(), 
        balance: 0, 
        status: userData.role === UserRole.ENTREPRENEUR ? 'pending' : 'active' 
      };
      
      const id = await db.users.add(data);
      const user = await db.users.get(id);
      
      return { result: 'success', user };
    } catch (e: any) {
      return { result: 'error', user: null, message: e.message };
    }
  },

  async syncData(email?: string) {
    logDB('SYNC ALL DATA');
    const [allUsers, services, bookings, jobs, transactions] = await Promise.all([
      db.users.toArray(),
      db.services.toArray(),
      db.bookings.toArray(),
      db.jobs.toArray(),
      db.transactions.toArray()
    ]);

    return {
      dynamicMentors: allUsers as UserSession[],
      services,
      bookings,
      jobs,
      transactions
    };
  },

  async recordTransaction(transaction: Partial<Transaction>) {
    logDB('RECORD TRANSACTION', transaction);
    const txId = await db.transactions.add({
      id: Math.random().toString(36).substr(2, 9),
      userId: transaction.userId || 'anonymous',
      amount: transaction.amount || 0,
      type: transaction.type || 'credit',
      description: transaction.description || 'Энергообмен ШАГ',
      status: 'completed',
      date: new Date().toISOString(),
      ...transaction
    } as Transaction);
    return txId;
  },

  async updateProfile(email: string, updates: any): Promise<{ result: string; message?: string }> {
    try {
      logDB('UPDATE PROFILE', email);
      const user = await db.users.where('email').equalsIgnoreCase(email).first();
      if (user && user.id) {
        await db.users.update(user.id, updates);
        return { result: 'success' };
      }
      return { result: 'error', message: 'Пользователь не найден' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async saveBooking(booking: any): Promise<{ result: string; message?: string }> {
    try {
      logDB('SAVE BOOKING', booking);
      // Если бронирование подтверждается (оплачено), создаем транзакцию
      if (booking.status === 'confirmed') {
        await this.recordTransaction({
          userId: booking.userEmail,
          amount: booking.price,
          description: `Оплата ШАГа: ${booking.serviceTitle || 'Персональный разбор'}`,
          type: 'debit'
        });
      }
      
      const exists = await db.bookings.get(booking.id);
      if (exists) {
        await db.bookings.update(booking.id, booking);
      } else {
        await db.bookings.add(booking);
      }
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async saveService(service: any): Promise<{ result: string; message?: string }> {
    try {
      logDB('SAVE SERVICE', service.title);
      if (service.id) {
        const exists = await db.services.get(service.id);
        if (exists) {
          await db.services.update(service.id, service);
        } else {
          await db.services.add(service);
        }
      } else {
        await db.services.add({ ...service, id: Math.random().toString(36).substr(2, 9) });
      }
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async deleteService(id: string): Promise<{ result: string; message?: string }> {
    try {
      logDB('DELETE SERVICE', id);
      await db.services.delete(id);
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async saveJob(job: any): Promise<{ result: string; message?: string }> {
    try {
      logDB('SAVE JOB', job.title);
      if (job.id) {
        const exists = await db.jobs.get(job.id);
        if (exists) {
          await db.jobs.update(job.id, job);
        } else {
          await db.jobs.add(job);
        }
      } else {
        await db.jobs.add({ ...job, id: Math.random().toString(36).substr(2, 9) });
      }
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async deleteJob(id: string): Promise<{ result: string; message?: string }> {
    try {
      logDB('DELETE JOB', id);
      await db.jobs.delete(id);
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async updateAvatar(email: string, url: string): Promise<{ result: string; message?: string }> {
    try {
      const user = await db.users.where('email').equalsIgnoreCase(email).first();
      if (user && user.id) {
        await db.users.update(user.id, { paymentUrl: url });
        return { result: 'success' };
      }
      return { result: 'error', message: 'User not found' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async getMessages(bookingId: string): Promise<ChatMessage[]> {
    return db.messages.where('bookingId').equals(bookingId).sortBy('timestamp');
  },

  async sendMessage(message: ChatMessage): Promise<{ result: string; message?: string }> {
    try {
      await db.messages.add(message);
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async getUsers(): Promise<UserSession[]> {
    const users = await db.users.toArray();
    return users as UserSession[];
  },
  
  async getServices(): Promise<Service[]> {
    return db.services.toArray();
  },

  async getBookings(): Promise<Booking[]> {
    return db.bookings.toArray();
  },

  async getJobs(): Promise<Job[]> {
    return db.jobs.toArray();
  },

  async getTransactions(): Promise<Transaction[]> {
    return db.transactions.toArray();
  },

  async rescheduleBooking(id: string, date: string, time: string) {
    try {
      await db.bookings.update(id, { date, time });
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async cancelBooking(id: string, reason: string) {
    try {
      await db.bookings.update(id, { status: 'cancelled' });
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async deleteBooking(id: string) {
    try {
      await db.bookings.delete(id);
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  }
};
