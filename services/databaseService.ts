
import { db } from './db';
import { Booking, UserSession, Service, Job, Auction, Bid, Transaction } from '../types';

const API_BASE = '';

// Помощник для быстрых запросов (таймаут 500мс для локального режима)
async function fetchWithTimeout(resource: string, options: any = {}, timeout = 500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

export const dbService = {
  async syncData(email?: string) {
    // Пытаемся синхронизироваться очень быстро, если не вышло — сразу отдаем локалку
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/sync`);
      if (res.ok) {
        const data = await res.json();
        if (data.users) await db.users.bulkPut(data.users);
        if (data.bookings) await db.bookings.bulkPut(data.bookings);
        if (data.services) await db.services.bulkPut(data.services);
        if (data.jobs) await db.jobs.bulkPut(data.jobs);
        if (data.auctions) await db.auctions.bulkPut(data.auctions);
        if (data.bids) await db.bids.bulkPut(data.bids);
      }
    } catch (e) {
      // Игнорируем ошибки сети для мгновенного отклика
    }

    const [u, s, b, j, t, auc, bids] = await Promise.all([
      db.users.toArray(),
      db.services.toArray(),
      db.bookings.toArray(),
      db.jobs.toArray(),
      db.transactions.toArray(),
      db.auctions.toArray(),
      db.bids.toArray()
    ]);

    return { 
      users: u, 
      services: s, 
      bookings: b, 
      jobs: j, 
      transactions: t,
      auctions: auc,
      bids: bids
    };
  },

  async register(user: any): Promise<{ result: 'success' | 'error'; user?: any; message?: string }> {
    try {
      const cleanEmail = user.email.toLowerCase().trim();
      const preparedUser = {
        ...user,
        email: cleanEmail,
        id: user.id || Math.random().toString(36).substr(2, 9),
        // В локальном режиме для тестов можно сразу ставить active, 
        // но оставим pending для логики модерации, просто ускорим процесс
        status: user.role === 'entrepreneur' ? 'pending' : 'active',
        balance: user.balance || 0,
        createdAt: new Date().toISOString()
      };

      // Сначала пишем в локальную БД — это мгновенно
      await db.users.put(preparedUser);

      // Синхронизацию с сервером запускаем, но не ждем её долго
      fetchWithTimeout(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedUser)
      }).catch(() => {}); 

      return { result: 'success', user: preparedUser };
    } catch (e: any) {
      return { result: 'error', message: e.message || 'Ошибка локальной БД' };
    }
  },

  async login(credentials: any) {
    const cleanEmail = credentials.email.toLowerCase().trim();
    const user = await db.users.get(cleanEmail);
    if (user && user.password === credentials.password) {
      return { ...user, isLoggedIn: true };
    }
    throw new Error('Неверный логин или пароль');
  },

  async saveBooking(booking: any): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      await db.bookings.put(booking);
      if (booking.status === 'confirmed') {
        await this.addTransaction({
          id: Math.random().toString(36).substr(2, 9),
          userId: booking.userEmail,
          amount: booking.price || 0,
          type: 'debit',
          description: `Оплата ШАГа: ${booking.serviceTitle}`,
          status: 'completed',
          date: new Date().toISOString()
        });
      }
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async saveService(service: any): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      const id = service.id || Math.random().toString(36).substr(2, 9);
      await db.services.put({ ...service, id });
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async updateProfile(email: string, updates: any): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      await db.users.update(email.toLowerCase(), updates);
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async updateAvatar(email: string, url: string): Promise<{ result: 'success' | 'error'; message?: string }> {
    return this.updateProfile(email, { paymentUrl: url });
  },

  async addTransaction(tx: Transaction) {
    await db.transactions.put(tx);
    return { result: 'success' };
  },

  async getAuctions() {
    return db.auctions.toArray();
  },

  async placeBid(bid: Bid, currentAuction: Auction) {
    try {
      await db.bids.add(bid);
      await db.auctions.update(currentAuction.id, {
        currentBid: bid.amount,
        bidsCount: (currentAuction.bidsCount || 0) + 1,
        topBidderId: bid.userId
      });
      await this.addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        userId: bid.userId,
        amount: bid.amount,
        type: 'debit',
        description: `Ставка на аукцион: ${bid.auctionId}`,
        status: 'completed',
        date: new Date().toISOString()
      });
      return { result: 'success' };
    } catch (e: any) {
      throw new Error(e.message);
    }
  },

  async cancelBooking(id: string, reason: string): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      await db.bookings.update(id, { status: 'cancelled' });
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async rescheduleBooking(id: string, date: string, time: string): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      await db.bookings.update(id, { date, time });
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async deleteBooking(id: string) {
    await db.bookings.delete(id);
    return { result: 'success' };
  },
  
  async getMessages(bookingId: string) { return db.messages.where('bookingId').equals(bookingId).toArray(); },
  async sendMessage(message: any) { await db.messages.put(message); return { result: 'success' }; },
  async deleteService(id: string) { await db.services.delete(id); return { result: 'success' }; },
  async saveJob(job: any) { await db.jobs.put(job as Job); return { result: 'success' }; },
  async deleteJob(id: string) { await db.jobs.delete(id); return { result: 'success' }; },
  async getUsers() { return db.users.toArray(); },
  async getServices() { return db.services.toArray(); },
  async getBookings() { return db.bookings.toArray(); },
  async getJobs() { return db.jobs.toArray(); },
  async getTransactions() { return db.transactions.toArray(); }
};
