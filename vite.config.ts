import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения из системы или .env файлов
  // Fix: Use '.' instead of process.cwd() to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Пробрасываем API_KEY для Gemini SDK, как того требует инструкция
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
    }
  };
});
