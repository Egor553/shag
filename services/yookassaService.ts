
import { YOOKASSA_CONFIG } from '../config/yookassa';

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

// Используем публичный CORS-прокси для обхода ограничений браузера при прямом вызове API
const PROXY_URL = 'https://corsproxy.io/?';
const API_ENDPOINT = 'https://api.yookassa.ru/v3/payments';

export const yookassaService = {
  generateIdempotencyKey() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  async createPayment(request: { 
    amount: number; 
    description: string; 
    metadata?: Record<string, any>; 
    return_url?: string 
  }): Promise<YooKassaPaymentResponse> {
    const auth = btoa(`${YOOKASSA_CONFIG.SHOP_ID}:${YOOKASSA_CONFIG.SECRET_KEY}`);
    
    // Формируем тело запроса по спецификации ЮKassa
    const body = {
      amount: {
        value: request.amount.toFixed(2),
        currency: YOOKASSA_CONFIG.CURRENCY
      },
      capture: true, // Автоматическое списание
      confirmation: {
        type: 'redirect',
        return_url: request.return_url || window.location.href
      },
      description: request.description,
      metadata: request.metadata
    };

    const response = await fetch(`${PROXY_URL}${encodeURIComponent(API_ENDPOINT)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': this.generateIdempotencyKey()
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('YooKassa API Error:', errorData);
      throw new Error(errorData.description || 'Ошибка создания платежа в ЮKassa');
    }

    return await response.json();
  },

  async checkPaymentStatus(paymentId: string): Promise<'pending' | 'succeeded' | 'canceled' | 'waiting_for_capture'> {
    const auth = btoa(`${YOOKASSA_CONFIG.SHOP_ID}:${YOOKASSA_CONFIG.SECRET_KEY}`);
    
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(`${API_ENDPOINT}/${paymentId}`)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      }
    });

    if (!response.ok) return 'pending';
    
    const data = await response.json();
    return data.status;
  }
};
