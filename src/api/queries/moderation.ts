import { fetchWithAuth } from '../../lib/fetchWithAuth';

const BASE = 'http://192.168.0.133:5001/moderation';

// بررسی یک متن قبل از ارسال
export const checkMessage = (text: string, receiverId: number) =>
  fetchWithAuth(`${BASE}/check`, {
    method: 'POST',
    body: JSON.stringify({ text, receiverId }),
  });

// بررسی ناهمگام (در پس‌زمینه)
export const checkMessageAsync = (text: string, receiverId: number, messageId?: number) =>
  fetchWithAuth(`${BASE}/check-async`, {
    method: 'POST',
    body: JSON.stringify({ text, receiverId, messageId }),
  });

// دریافت ریسک کاربر (برای ادمین)
export const getUserRiskProfile = (userId: number) =>
  fetchWithAuth(`${BASE}/user/${userId}/risk`);

// آمار روزانه (ادمین)
export const getDailyStats = (days = 7) =>
  fetchWithAuth(`${BASE}/stats/daily?days=${days}`);

// لیست کاربران پرخطر (ادمین)
export const getHighRiskUsers = (limit = 20, minSeverity = 'high') =>
  fetchWithAuth(`${BASE}/high-risk-users?limit=${limit}&minSeverity=${minSeverity}`);

// رفع محدودیت کاربر (ادمین)
export const unblockUser = (userId: number) =>
  fetchWithAuth(`${BASE}/user/${userId}/unblock`, { method: 'POST' });

// بررسی سلامت سرویس
export const moderationHealthCheck = () =>
  fetchWithAuth(`${BASE}/health`);