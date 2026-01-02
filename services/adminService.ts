
import { WEBHOOK_URL } from './databaseService';
import { UserSession, Service, Job, Booking, Transaction } from '../types';

export const adminService = {
  /**
   * Получает абсолютно все данные из таблиц для админ-панели
   */
  async getFullRegistry() {
    try {
      // Запрашиваем без email, чтобы скрипт вернул полные списки
      const url = `${WEBHOOK_URL}?action=sync&admin_access=true`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      return {
        users: data.dynamicMentors || [],
        services: data.services || [],
        bookings: data.bookings || [],
        jobs: data.jobs || [],
        transactions: data.transactions || [] // В админке транзакции могут быть нужны все
      };
    } catch (e) {
      console.error('Admin Sync Error:', e);
      throw e;
    }
  },

  /**
   * Модерация пользователя
   */
  async setUserStatus(email: string, status: 'active' | 'rejected') {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'update_profile',
          email: email,
          updates: { status: status }
        })
      });
      return await response.json();
    } catch (e) {
      console.error('Moderation Error:', e);
      throw e;
    }
  },

  /**
   * Глобальное удаление (очистка таблиц)
   */
  async wipeData(type: 'services' | 'jobs' | 'bookings') {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'clear_all',
          type: type
        })
      });
      return await response.json();
    } catch (e) {
      throw e;
    }
  }
};
