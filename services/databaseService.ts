
import { UserSession, Booking } from '../types';

// Ссылка на ваш Google Apps Script. Обязательно разверните свой скрипт!
export const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz9Wop9I4Ka1XCf6XVeL1b0E2b_I5xpuK7jPEqRU1aYO6NYCHYMex22lvOwiKgI_-QR/exec';

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
      throw new Error('Ошибка входа. Проверьте соединение с бэкендом.');
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

  async saveBooking(booking: Partial<Booking>) {
    return this.postAction({ action: 'save_booking', ...booking });
  },

  async updateProfile(email: string, updates: Partial<UserSession>) {
    return this.postAction({ action: 'update_profile', email, updates });
  },

  async updateService(id: string, updates: any) {
    return this.postAction({ action: 'update_service', id, updates });
  },

  async deleteService(id: string) {
    return this.postAction({ action: 'delete_service', id });
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
