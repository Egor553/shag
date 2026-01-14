
import { dbService } from './databaseService';
import { UserSession, Service, Job, Booking, Transaction } from '../types';

export const adminService = {
  /**
   * Получает абсолютно все данные для админ-панели из локального хранилища
   */
  async getFullRegistry() {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    // Await database calls to ensure data is returned correctly
    return {
      users: await dbService.getUsers(),
      services: await dbService.getServices(),
      bookings: await dbService.getBookings(),
      jobs: await dbService.getJobs(),
      transactions: await dbService.getTransactions(),
      reviews: await dbService.getReviews()
    };
  },

  /**
   * Одобрение пользователя (модерация)
   */
  async approveUser(email: string) {
    return dbService.updateProfile(email, { status: 'active' });
  },

  /**
   * Отказ пользователю
   */
  async rejectUser(email: string) {
    return dbService.updateProfile(email, { status: 'rejected' });
  }
};
