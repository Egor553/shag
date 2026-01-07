
import { UserSession, Booking, ChatMessage, Service, Job, Transaction, UserRole } from '../types';
import { db, initDefaultData } from './db';

const API_BASE = window.location.origin;

const logDB = (op: string, data?: any) => {
  console.log(`%c[DB_SYNC] ${op}`, 'color: #10b981; font-weight: bold;', data || '');
};

initDefaultData().catch(err => console.error('[DB_FATAL]', err));

export const dbService = {
  async login(credentials: { email: string; password: string }) {
    // В продакшене лучше проверять через API, но пока синхронизируем локально
    const email = credentials.email.trim().toLowerCase();
    const user = await db.users.get(email);

    if (!user || String(user.password) !== credentials.password) {
      throw new Error('Неверный логин или пароль');
    }
    
    logDB('USER_AUTH_SUCCESS', email);
    return { ...user, isLoggedIn: true } as UserSession;
  },

  async register(userData: any): Promise<{ result: string; user: any; message?: string }> {
    try {
      const email = userData.email.toLowerCase().trim();
      const data = { 
        ...userData,
        email,
        id: `u_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(), 
        balance: 0, 
        status: userData.role === UserRole.ENTREPRENEUR ? 'pending' : 'active' 
      };

      // Пробуем сохранить на сервере
      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await db.users.put(data); // Дублируем в локальный кэш
        return { result: 'success', user: data };
      } else {
        const err = await response.json();
        return { result: 'error', user: null, message: err.message };
      }
    } catch (e: any) {
      // Если сервер недоступен, работаем локально
      await db.users.put(userData);
      return { result: 'success', user: userData };
    }
  },

  async syncData(email?: string) {
    try {
      const response = await fetch(`${API_BASE}/api/sync`);
      if (response.ok) {
        const serverData = await response.json();
        
        // Обновляем локальный Dexie данными с сервера
        await Promise.all([
          db.users.bulkPut(serverData.users || []),
          db.services.bulkPut(serverData.services || []),
          db.bookings.bulkPut(serverData.bookings || []),
          db.jobs.bulkPut(serverData.jobs || []),
          db.transactions.bulkPut(serverData.transactions || [])
        ]);

        return {
          dynamicMentors: serverData.users as UserSession[],
          services: serverData.services,
          bookings: serverData.bookings,
          jobs: serverData.jobs,
          transactions: serverData.transactions
        };
      }
    } catch (e) {
      console.warn('[DB] Работа в офлайн режиме');
    }

    // Фолбэк на локальный Dexie
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

  async updateProfile(email: string, updates: any): Promise<{ result: string; message?: string }> {
    const cleanEmail = email.toLowerCase().trim();
    try {
      await fetch(`${API_BASE}/api/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, updates })
      });
    } catch (e) {}
    
    await db.users.update(cleanEmail, updates);
    return { result: 'success' };
  },

  async saveBooking(booking: any): Promise<{ result: string; message?: string }> {
    // В реальном приложении здесь должен быть POST запрос к API
    await db.bookings.put(booking);
    return { result: 'success' };
  },

  async saveService(service: any): Promise<{ result: string; message?: string }> {
    const data = { ...service };
    if (!data.id) data.id = `svc_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      await fetch(`${API_BASE}/api/save-service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {}

    await db.services.put(data);
    return { result: 'success' };
  },

  // Fix: Added explicit return types to satisfy property access in consumers like BookingModal.tsx
  async rescheduleBooking(id: string, date: string, time: string): Promise<{ result: string; message?: string }> { 
    await db.bookings.update(id, { date, time }); 
    return { result: 'success' }; 
  },
  
  async cancelBooking(id: string, reason: string): Promise<{ result: string; message?: string }> { 
    await db.bookings.update(id, { status: 'cancelled' }); 
    return { result: 'success' }; 
  },
  
  async deleteBooking(id: string): Promise<{ result: string; message?: string }> { 
    await db.bookings.delete(id); 
    return { result: 'success' }; 
  },
  
  async getMessages(bookingId: string) { return db.messages.where('bookingId').equals(bookingId).sortBy('timestamp'); },
  async sendMessage(message: ChatMessage) { await db.messages.put(message); return { result: 'success' }; },
  async deleteService(id: string) { await db.services.delete(id); return { result: 'success' }; },
  async saveJob(job: any) { await db.jobs.put(job); return { result: 'success' }; },
  async deleteJob(id: string) { await db.jobs.delete(id); return { result: 'success' }; },
  async updateAvatar(email: string, url: string) { await db.users.update(email.toLowerCase().trim(), { paymentUrl: url }); return { result: 'success' }; },
  async getUsers() { return db.users.toArray(); },
  async getServices() { return db.services.toArray(); },
  async getBookings() { return db.bookings.toArray(); },
  async getJobs() { return db.jobs.toArray(); },
  async getTransactions() { return db.transactions.toArray(); }
};
