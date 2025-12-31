
import { UserSession, Mentor, Service, Booking, Job } from '../types';

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxh7EBk00r4sKIEd8D9Znt-4qFYB4MpOuw0vV1bqjk7YK2NFC-TA9WNE6fpdd2k6ZrG/exec';

export const dbService = {
  async syncData(email?: string) {
    try {
      const url = email ? `${WEBHOOK_URL}?action=sync&email=${encodeURIComponent(email)}` : `${WEBHOOK_URL}?action=sync`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Sync failed');
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('Sync error:', e);
      return { result: 'error', dynamicMentors: [], services: [], bookings: [], jobs: [] };
    }
  },

  async login(credentials: { email: string; password: string }) {
    const url = `${WEBHOOK_URL}?action=login&email=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.result === 'success') {
      return data.user;
    } else {
      throw new Error(data.message || 'Ошибка входа');
    }
  },

  async register(data: any) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'register', ...data })
    });
  },

  async updateProfile(email: string, updates: Partial<UserSession | Mentor>) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'update_profile', email, updates })
    });
  },

  async updateAvatar(email: string, avatarUrl: string) {
    return this.updateProfile(email, { paymentUrl: avatarUrl } as any);
  },

  async saveService(service: Service) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'save_service', ...service })
    });
  },

  async updateService(id: string, updates: Partial<Service>) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'update_service', id, updates })
    });
  },

  async deleteService(id: string) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'delete_service', id })
    });
  },

  async saveJob(job: Job) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'save_job', ...job })
    });
  },

  async deleteJob(id: string) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'delete_job', id })
    });
  },

  async createBooking(booking: any) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'booking', ...booking, id: Math.random().toString(36).substr(2, 9), status: 'pending' })
    });
  }
};
