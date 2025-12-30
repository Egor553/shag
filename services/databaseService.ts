
import { UserSession, Mentor, Service, Booking } from '../types';

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw-vLE2tD_o_81T3UbQcVSiqKfR7GztS7uKXRv8-uQJnmyi_wfm27lkTr2hryllzvEz/exec';

export const dbService = {
  async syncData(email?: string) {
    try {
      const url = email ? `${WEBHOOK_URL}?action=sync&email=${encodeURIComponent(email)}` : `${WEBHOOK_URL}?action=sync`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Sync failed');
      return await response.json();
    } catch (e) {
      console.error('Sync error:', e);
      return { result: 'error', dynamicMentors: [], services: [], bookings: [] };
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
    // Используем POST с mode: no-cors для обхода ограничений GAS на стороне браузера при записи
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ action: 'register', ...data })
    });
  },

  async updateAvatar(email: string, avatarUrl: string) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'save_avatar', email, avatarUrl })
    });
  },

  async saveService(service: Service) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'save_service', ...service })
    });
  },

  async deleteService(id: string) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'delete_service', id })
    });
  },

  async saveMentorProfile(profile: Mentor, email: string) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ 
        action: 'save_mentor', 
        ...profile, 
        ownerEmail: email,
        createdAt: new Date().toISOString()
      })
    });
  },

  async createBooking(booking: any) {
    return await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'booking', ...booking })
    });
  }
};
