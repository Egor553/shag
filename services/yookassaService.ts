
export const yookassaService = {
  /**
   * Создает платеж через серверную функцию.
   * Возвращает объект с confirmation_url для редиректа.
   */
  async createPayment(request: { amount: number; description: string; metadata?: any; return_url?: string }) {
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.description || data.error || 'Ошибка при создании платежа в ЮKassa');
      }
      
      return data;
    } catch (error: any) {
      console.error('[ЮKassa] Create Payment Error:', error);
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
