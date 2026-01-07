
import { Service } from '../types';
import { dbService } from './databaseService';

export const shagService = {
  // Using saveService from dbService for saving new services
  async save(service: Service) {
    return dbService.saveService(service);
  },

  // Using saveService from dbService for updates (id is already in the object)
  async update(id: string, updates: Partial<Service>) {
    return dbService.saveService({ ...updates, id });
  },

  // Using deleteService from dbService
  async delete(id: string) {
    return dbService.deleteService(id);
  }
};
