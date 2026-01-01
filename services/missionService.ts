
import { Job } from '../types';
import { dbService } from './databaseService';

export const missionService = {
  async save(job: Job) {
    return dbService.postAction({ action: 'save_job', ...job });
  },

  async update(id: string, updates: Partial<Job>) {
    return dbService.postAction({ action: 'update_job', id, updates });
  },

  async delete(id: string) {
    return dbService.postAction({ action: 'delete_job', id });
  }
};
