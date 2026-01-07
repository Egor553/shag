
import { Job } from '../types';
import { dbService } from './databaseService';

export const missionService = {
  // Using saveJob from dbService for saving new jobs
  async save(job: Job) {
    return dbService.saveJob(job);
  },

  // Using saveJob from dbService for updates (id is already in the object)
  async update(id: string, updates: Partial<Job>) {
    return dbService.saveJob({ ...updates, id });
  },

  // Using deleteJob from dbService
  async delete(id: string) {
    return dbService.deleteJob(id);
  }
};
