import { db } from './db';
import { Booking, UserSession, Service, Job, Auction, Bid, Transaction } from '../types';

const API_BASE = ''; // Relative path, works via proxy in dev and normal path in prod

// Fetch with timeout helper
async function fetchWithTimeout(resource: string, options: any = {}, timeout = 8000) {
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
    try {
      const res = await fetchWithTimeout(`${API_BASE}/api/sync`);
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.users?.length) await db.users.bulkPut(data.users);
        if (data.bookings?.length) await db.bookings.bulkPut(data.bookings);
        if (data.services?.length) await db.services.bulkPut(data.services);
        if (data.jobs?.length) await db.jobs.bulkPut(data.jobs);
        if (data.transactions?.length) await db.transactions.bulkPut(data.transactions);
      }
    } catch (e) {
      console.log('API Offline or invalid response: Using local storage');
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
      if (!user.email || !user.password) {
        throw new Error('Email и пароль обязательны');
      }

      const cleanEmail = user.email.toLowerCase().trim();
      const preparedUser = {
        ...user,
        email: cleanEmail,
        id: user.id || Math.random().toString(36).substr(2, 9),
        status: user.role === 'entrepreneur' ? 'pending' : 'active',
        balance: user.balance || 0,
        createdAt: new Date().toISOString()
      };

      // 1. Send to Server First
      try {
        const response = await fetchWithTimeout(`${API_BASE}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preparedUser)
        });

        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
          const serverData = await response.json();
          if (serverData.result === 'error') throw new Error(serverData.message);
        } else {
          // If server returns HTML (proxy fail) or error
          throw new Error('Server unavailable');
        }
      } catch (e) {
        console.warn('Server reg failed, saving locally only', e);
      }

      // 2. Save locally (Always success if updated locally)
      await db.users.put(preparedUser);

      return { result: 'success', user: preparedUser };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async login(credentials: any) {
    if (!credentials.email) throw new Error('Введите email');
    const cleanEmail = credentials.email.toLowerCase().trim();

    // 1. Try Server Login
    try {
      const response = await fetchWithTimeout(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: credentials.password })
      }, 5000);

      const contentType = response.headers.get("content-type");
      if (response.ok && contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.result === 'success') {
          await db.users.put(data.user);
          return { ...data.user, isLoggedIn: true };
        }
      }
    } catch (e) {
      console.warn('Server login failed, falling back to local', e);
    }

    // 2. Fallback to Local Login
    const user = await db.users.get(cleanEmail);
    if (user && String(user.password) === String(credentials.password)) {
      return { ...user, isLoggedIn: true };
    }
    throw new Error('Неверный логин или пароль');
  },

  async saveBooking(booking: any): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      await db.bookings.put(booking);

      fetch(`${API_BASE}/api/save-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      }).catch(console.error);

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
    return this.updateProfile(email, { avatarUrl: url });
  },

  async addTransaction(tx: Transaction) {
    await db.transactions.put(tx);
    return { result: 'success' };
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

  async saveReview(review: any): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      await (db as any).reviews.put(review);
      fetch(`${API_BASE}/api/save-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      }).catch(console.error);
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async updateBookingStatus(id: string, status: string): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      await db.bookings.update(id, { status: status as any });
      fetch(`${API_BASE}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).catch(console.error);
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
  },

  async deleteBooking(id: string) {
    await db.bookings.delete(id);
    return { result: 'success' };
  },

  async placeBid(bid: Bid, auction: Auction): Promise<{ result: 'success' | 'error'; message?: string }> {
    try {
      await db.bids.put(bid);
      await db.auctions.update(auction.id, {
        currentBid: bid.amount,
        bidsCount: (auction.bidsCount || 0) + 1,
        topBidderId: bid.userId
      });
      return { result: 'success' };
    } catch (e: any) {
      return { result: 'error', message: e.message };
    }
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
  async getTransactions() { return db.transactions.toArray(); },
  async getReviews(mentorId?: string) {
    if (mentorId) return (db as any).reviews.where('mentorId').equals(mentorId).toArray();
    return (db as any).reviews.toArray();
  }
};