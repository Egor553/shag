
import { UserSession, Booking } from '../types';

// URL вашего Google Apps Script
export const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyeHV9EI0-XuL5JOUTrFocyBPd5ZHOu5hSKi0Q9AF5VPKLKogt14DCqMUyZUSuqMr5_/exec';

export const dbService = {
  async syncData(email?: string) {
    try {
      const url = email 
        ? `${WEBHOOK_URL}?action=sync&email=${encodeURIComponent(email)}` 
        : `${WEBHOOK_URL}?action=sync`;
      
      const response = await fetch(url).catch(() => null);
      if (!response || !response.ok) {
        return { result: 'offline', dynamicMentors: null, services: [], bookings: [], jobs: [], transactions: [] };
      }
      return await response.json();
    } catch (e) {
      console.error('Sync error:', e);
      return { result: 'error', dynamicMentors: null, services: [], bookings: [], jobs: [], transactions: [] };
    }
  },

  async login(credentials: { email: string; password: string }) {
    try {
      const url = `${WEBHOOK_URL}?action=login&email=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.result === 'success') {
        return data.user;
      } else {
        throw new Error(data.message || 'Неверный логин или пароль');
      }
    } catch (e: any) {
      throw new Error(e.message || 'Ошибка входа. Проверьте соединение с бэкендом.');
    }
  },

  async register(data: any) {
    return this.postAction({ action: 'register', ...data });
  },

  async postAction(payload: any) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      }).catch(() => null);

      if (!response) return { result: 'error', message: 'Бэкенд недоступен' };
      
      const data = await response.json();
      return data;
    } catch (e) {
      return { result: 'error', message: 'Ошибка сети' };
    }
  },

  /**
   * Инициализация реального платежа через ЮKassa
   */
  async createPayment(bookingData: Partial<Booking>) {
    // 1. Сначала сохраняем бронь со статусом 'pending'
    const saveRes = await this.saveBooking({ ...bookingData, status: 'pending' });
    if (saveRes.result !== 'success') return saveRes;

    // 2. Запрашиваем у бэкенда создание платежа в ЮKassa
    return this.postAction({
      action: 'create_yookassa_payment',
      bookingId: bookingData.id,
      amount: bookingData.price,
      description: `Оплата ШАГа: ${bookingData.serviceTitle}`
    });
  },

  async saveBooking(booking: Partial<Booking>) {
    return this.postAction({ action: 'save_booking', ...booking });
  },

  async updateProfile(email: string, updates: Partial<UserSession>) {
    return this.postAction({ action: 'update_profile', email, updates });
  },

  async saveService(service: any) {
    return this.postAction({ action: 'save_service', ...service });
  },

  async updateService(id: string, updates: any) {
    return this.postAction({ action: 'update_service', id, updates });
  },

  async deleteService(id: string) {
    return this.postAction({ action: 'delete_service', id });
  },

  async saveJob(job: any) {
    return this.postAction({ action: 'save_job', ...job });
  },

  async updateJob(id: string, updates: any) {
    return this.postAction({ action: 'update_job', id, updates });
  },

  async deleteJob(id: string) {
    return this.postAction({ action: 'delete_job', id });
  },

  async sendMessage(message: any) {
    return this.postAction({ action: 'send_message', ...message });
  },

  async updateAvatar(email: string, avatarUrl: string) {
    return this.updateProfile(email, { paymentUrl: avatarUrl });
  },

  async clearAll(type: 'services' | 'jobs' | 'bookings') {
    return this.postAction({ action: 'clear_all', type });
  },

  async updateBookingStatus(id: string, status: string) {
    return this.postAction({
      action: 'update_booking',
      id: id,
      updates: { status }
    });
  },

  async cancelBooking(bookingId: string, reason?: string) {
    return this.postAction({ 
      action: 'cancel_booking', 
      id: bookingId, 
      reason: reason || 'Отмена' 
    });
  },

  async rescheduleBooking(bookingId: string, newDate: string, newTime: string) {
    return this.postAction({
      action: 'update_booking',
      id: bookingId,
      updates: { date: newDate, time: newTime, status: 'confirmed' }
    });
  },

  async deleteUser(email: string) {
    return this.postAction({ action: 'delete_user', email });
  },

  async deleteBooking(id: string) {
    return this.postAction({ action: 'delete_booking', id });
  },

  async getMessages(bookingId: string) {
    try {
      const url = `${WEBHOOK_URL}?action=get_messages&bookingId=${encodeURIComponent(bookingId)}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.messages || [];
    } catch (e) {
      return [];
    }
  }
};
