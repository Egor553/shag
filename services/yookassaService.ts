
export const yookassaService = {
  /**
   * Создает платеж через серверную функцию с таймаутом.
   */
  async createPayment(request: { amount: number; description: string; metadata?: any; return_url?: string }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 секунд на ответ от шлюза

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.description || data.error || 'Ошибка при создании платежа в ЮKassa');
      }
      
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('[ЮKassa] Create Payment Error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Платежный шлюз не ответил вовремя. Попробуйте еще раз или используйте тестовый режим.');
      }
      throw error;
    }
  },

  /**
   * Проверяет текущий статус платежа.
   */
  async checkPaymentStatus(paymentId: string) {
    try {
      const response = await fetch(`/api/check-payment?id=${paymentId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Не удалось проверить статус платежа');
      }
      
      return data.status; // 'pending', 'succeeded', 'waiting_for_capture', 'canceled'
    } catch (error) {
      console.error('[ЮKassa] Check Status Error:', error);
      return 'pending';
    }
  }
};
