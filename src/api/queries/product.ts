import { fetchWithAuth } from '../../lib/fetchWithAuth';

const BASE = 'http://192.168.0.133:5001';

// دریافت محصولات عمومی (Boost, Credit, VIP)
export const fetchPublicProducts = () =>
  fetchWithAuth(`${BASE}/product/public`);

// شروع یک پرداخت برای یک محصول خاص
export const startPayment = (productId: string) =>
  fetchWithAuth(`${BASE}/payments/start`, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });