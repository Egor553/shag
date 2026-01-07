
export const yookassaService = {
  async createPayment(request: { amount: number; description: string; metadata?: any; return_url?: string }) {
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.description || 'Ошибка ЮKassa');
    }
    return await response.json();
  },

  async checkPaymentStatus(paymentId: string) {
    try {
      const response = await fetch(`/api/check-payment/${paymentId}`);
      const data = await response.json();
      return data.status; // 'pending', 'succeeded', 'canceled'
    } catch (e) {
      return 'pending';
    }
  }
};
