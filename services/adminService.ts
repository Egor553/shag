
import { WEBHOOK_URL } from './databaseService';
import { UserSession, Service, Job, Booking, Transaction } from '../types';

export const adminService = {
  /**
   * Получает абсолютно все данные из всех листов для админ-панели
   */
  async getFullRegistry() {
    try {
      // Передаем admin_access=true, чтобы скрипт вернул полные данные
      const url = `${WEBHOOK_URL}?action=sync&admin_access=true`;
      console.log('Fetching admin data from:', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      console.log('Admin data received:', data);

      return {
        users: data.dynamicMentors || [],
        services: data.services || [],
        bookings: data.bookings || [],
        jobs: data.jobs || [],
        transactions: data.transactions || []
      };
    } catch (e) {
      console.error('Admin Sync Error:', e);
      throw e;
    }
  },

  /**
   * Одобрение пользователя (перенос из PendingUsers в Users)
   */
  async approveUser(email: string) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'approve_user',
          email: email
        })
      });
      return await response.json();
    } catch (e) {
      console.error('Approve Error:', e);
      throw e;
    }
  },

  /**
   * Отказ пользователю
   */
  async rejectUser(email: string) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'reject_user',
          email: email
        })
      });
      return await response.json();
    } catch (e) {
      console.error('Reject Error:', e);
      throw e;
    }
  }
};
