
export interface YooKassaPaymentResponse {
  id: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  confirmation?: {
    type: 'redirect';
    confirmation_url: string;
  };
  amount: {
    value: string;
    currency: string;
  };
  created_at: string;
}

export const yookassaService = {
  async createPayment(request: { 
    amount: number; 
    description: string; 
    metadata?: Record<string, any>; 
    return_url?: string 
  }): Promise<YooKassaPaymentResponse> {
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.description || 'Ошибка создания платежа через сервер.');
    }

    return await response.json();
  },

  async checkPaymentStatus(paymentId: string): Promise<'pending' | 'succeeded' | 'canceled' | 'waiting_for_capture'> {
    try {
      const response = await fetch(`/api/check-payment/${paymentId}`);
      if (!response.ok) return 'pending';
      const data = await response.json();
      return data.status;
    } catch (e) {
      return 'pending';
    }
  }
};
