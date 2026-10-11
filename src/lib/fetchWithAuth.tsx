import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDeviceHeaders} from './deviceInfo';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    const method = (options.method || 'GET').toUpperCase();
    const isFormData = options.body instanceof FormData;

    const authToken =
      (await AsyncStorage.getItem('auth_token')) ||
      (await AsyncStorage.getItem('temp_auth_token'));
    const deviceHeaders = await getDeviceHeaders();
    const headers: Record<string, string> = {
      ...(isFormData ? {} : {'Content-Type': 'application/json'}),
      ...(options.headers || {}),
      ...deviceHeaders,
      ...(authToken ? {Authorization: `Bearer ${authToken}`} : {}),
    };
    // console.log(authToken);
    const response = await fetch(url, {...options, headers});

    // 401 فقط در /auth/me باعث حذف توکن می‌شود
    if (response.status === 401) {
      if (url.includes('/auth/me')) {
        await AsyncStorage.removeItem('auth_token');
      }
      throw new Error('UNAUTHORIZED');
    }

    const raw = await response.text();
    // console.log('FULL RAW RESPONSE:', raw);
    let parsed: any = null;

    try {
      parsed = JSON.parse(raw);
    } catch {
      // اگر JSON نبود ولی ok=false بود:
      if (!response.ok) throw new Error('خطا در سرور');
      return raw; // پاسخ متنی
    }
    // console.log('response', response);
    // ✔️ پیام واقعی سرور را بدون تغییر بده
    if (!response.ok) {
      throw {
        message: parsed?.message || 'خطا در سرور',
        code: parsed?.code || null, // ← اگر نبود null می‌شود
        status: response.status,
      };
    }
    return parsed;
  } catch (err) {
    console.error('❌ fetchWithAuth error:', err);
    throw err;
  }
};
