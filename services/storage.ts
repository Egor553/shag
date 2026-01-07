
// Локальное хранилище теперь используется только как кэш для синхронизации
export const storage = {
  get<T>(key: string): T[] {
    const data = localStorage.getItem(`shag_cache_${key}`);
    return data ? JSON.parse(data) : [];
  },
  set<T>(key: string, data: T[]) {
    localStorage.setItem(`shag_cache_${key}`, JSON.stringify(data));
  },
  init() {
    // Инициализация происходит на стороне Google Apps Script
  }
};
