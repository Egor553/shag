
import { db } from './db';
// Added Booking import to fix typing issues with status updates
import { Booking } from '../types';

const API_BASE = '';

export const dbService = {
  async syncData(email?: string) {
    try {
      const res = await fetch(`${API_BASE}/api/sync`);
      const data = await res.json();
      
      if (data.users) await db.users.bulkPut(data.users);
      if (data.bookings) await db.bookings.bulkPut(data.bookings);
      if (data.services) await db.services.bulkPut(data.services);
      if (data.jobs) await db.jobs.bulkPut(data.jobs);
      
      return {
        ...data,
        dynamicMentors: data.users || []
      };
    } catch (e) {
      console.warn('Sync failed, using local DB');
      const [u, s, b, j] = await Promise.all([
        db.users.toArray(),
        db.services.toArray(),
        db.bookings.toArray(),
        db.jobs.toArray()
      ]);
      return { users: u, dynamicMentors: u, services: s, bookings: b, jobs: j, transactions: [] };
    }
  },

  async register(user: any) {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) throw new Error('Registration failed');
    await db.users.put(user);
    return { result: 'success', user, message: 'Успешно' };
  },

  async login(credentials: any) {
    const user = await db.users.get(credentials.email.toLowerCase());
    if (user && user.password === credentials.password) return { ...user, isLoggedIn: true };
    throw new Error('Неверный логин или пароль');
  },

  // Added message property to the return object to satisfy component requirements
  async saveBooking(booking: any) {
    await fetch(`${API_BASE}/api/save-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    await db.bookings.put(booking);
    return { result: 'success', message: 'Запись успешно сохранена' };
  },

  // Added message property to the return object to satisfy component requirements
  async saveService(service: any) {
    await fetch(`${API_BASE}/api/save-service`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });
    await db.services.put(service);
    return { result: 'success', message: 'Сервис успешно сохранен' };
  },

  // Added message property to the return object to satisfy component requirements
  async updateProfile(email: string, updates: any) {
    await fetch(`${API_BASE}/api/update-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, updates })
    });
    await db.users.update(email, updates);
    return { result: 'success', message: 'Профиль успешно обновлен' };
  },

  async updateAvatar(email: string, paymentUrl: string) {
    return this.updateProfile(email, { paymentUrl });
  },

  // Explicitly typed updates as Partial<Booking> to ensure status is correctly inferred as the union type
  async cancelBooking(id: string, reason: string) {
    const updates: Partial<Booking> = { status: 'cancelled' };
    await fetch(`${API_BASE}/api/save-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    await db.bookings.update(id, updates);
    return { result: 'success', message: 'Запись отменена' };
  },

  // Typed updates as Partial<Booking> for consistency and added message property
  async rescheduleBooking(id: string, date: string, time: string) {
    const updates: Partial<Booking> = { date, time };
    await fetch(`${API_BASE}/api/save-booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    await db.bookings.update(id, updates);
    return { result: 'success', message: 'Встреча успешно перенесена' };
  },

  async deleteBooking(id: string) {
    await db.bookings.delete(id);
    return { result: 'success' };
  },
  
  async getMessages(bookingId: string) { return db.messages.where('bookingId').equals(bookingId).toArray(); },
  async sendMessage(message: any) { await db.messages.put(message); return { result: 'success' }; },
  async deleteService(id: string) { await db.services.delete(id); return { result: 'success' }; },
  // Added message property for consistency
  async saveJob(job: any) { await db.jobs.put(job); return { result: 'success', message: 'Вакансия сохранена' }; },
  async deleteJob(id: string) { await db.jobs.delete(id); return { result: 'success' }; },
  async getUsers() { return db.users.toArray(); },
  async getServices() { return db.services.toArray(); },
  async getBookings() { return db.bookings.toArray(); },
  async getJobs() { return db.jobs.toArray(); },
  async getTransactions() { return db.transactions.toArray(); }
};
