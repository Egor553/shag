
import { Service } from '../types';
import { dbService } from './databaseService';

export const shagService = {
  async save(service: Service) {
    return dbService.postAction({ action: 'save_service', ...service });
  },

  async update(id: string, updates: Partial<Service>) {
    return dbService.postAction({ action: 'update_service', id, updates });
  },

  async delete(id: string) {
    return dbService.postAction({ action: 'delete_service', id });
  }
};
