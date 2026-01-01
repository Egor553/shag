
import { UserSession, Mentor, Service, Booking, ChatMessage, Review, Transaction, Job } from '../types';

// Актуальный URL вебхука Google Apps Script
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzFJUTMIqOLYJpBAqEx5wgMDNHmJL-7PNJLtMOMbkCLZkAXcPVMWMoBr9rePcRHhoNJ/exec';

export const dbService = {
  async syncData(email?: string) {
    try {
      const url = email 
        ? `${WEBHOOK_URL}?action=sync&email=${encodeURIComponent(email)}` 
        : `${WEBHOOK_URL}?action=sync`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Sync failed');
      return await response.json();
    } catch (e) {
      console.error('Sync error:', e);
      return { 
        result: 'error', 
        dynamicMentors: [], 
        services: [], 
        bookings: [], 
        jobs: [],
        reviews: [],
        transactions: []
      };
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
      throw new Error(e.message || 'Ошибка входа');
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
      });
      const data = await response.json();
      if (data.result !== 'success') {
        console.error('Database Error:', data.message);
      }
      return data;
    } catch (e) {
      console.error("Network Error", e);
      return { result: 'error', message: 'Ошибка сети' };
    }
  },

  async updateProfile(email: string, updates: Partial<UserSession>) {
    return this.postAction({ action: 'update_profile', email, updates });
  },

  async saveService(service: Service) {
    return this.postAction({ action: 'save_service', ...service });
  },

  async updateService(id: string, updates: Partial<Service>) {
    return this.postAction({ action: 'update_service', id, updates });
  },

  async deleteService(id: string) {
    return this.postAction({ action: 'delete_service', id });
  },

  async saveJob(job: Job) {
    return this.postAction({ action: 'save_job', ...job });
  },

  async updateJob(id: string, updates: Partial<Job>) {
    return this.postAction({ action: 'update_job', id, updates });
  },

  async deleteJob(id: string) {
    return this.postAction({ action: 'delete_job', id });
  },

  async createBooking(booking: any) {
    return this.postAction({ action: 'booking', ...booking });
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

  async clearAll(type: 'services' | 'jobs' | 'bookings') {
    return this.postAction({ action: 'clear_all', type });
  },

  async getMessages(bookingId: string) {
    try {
      const url = `${WEBHOOK_URL}?action=get_messages&bookingId=${encodeURIComponent(bookingId)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      return data.messages || [];
    } catch (e) {
      console.error('getMessages error:', e);
      return [];
    }
  },

  async sendMessage(message: ChatMessage) {
    return this.postAction({ action: 'send_message', ...message });
  },

  async updateAvatar(email: string, avatarUrl: string) {
    return this.updateProfile(email, { paymentUrl: avatarUrl });
  }
};
