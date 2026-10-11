import {
  registerStep1Schema,
  loginSchema,
  MultiStepProfilePayload,
  verifyTelegramCodeSchema,
} from '../../../schemas/authSchemas';
import {z} from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';
import {getDeviceHeaders} from '../../../lib/deviceInfo';

const API_BASE = 'http://192.168.0.133:5001';

// ─── Helper بدون auth (برای مراحل ثبت‌نام) ────────────────────────────────

async function publicFetch(url: string, options: any = {}) {
  const deviceHeaders = await getDeviceHeaders();

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...deviceHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw {message: data.message || 'REQUEST_FAILED', code: data.code || null};
  }

  return data;
}

// ─── مراحل ثبت‌نام (بدون auth) ──────────────────────────────────────────────

export const registerStep1 = async (
  data: z.infer<typeof registerStep1Schema>,
) => {
  console.log('data', data);
  return publicFetch(`${API_BASE}/auth/register/step1`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const saveWhatsAppOtp = async (data: {phone: string; otp: string}) => {
  return publicFetch(`${API_BASE}/auth/register/whatsapp/save-otp`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const verifyWhatsApp = async (phone: string | null) => {
  return publicFetch(`${API_BASE}/auth/register/whatsapp/verify`, {
    method: 'POST',
    body: JSON.stringify({phone}),
  });
};

export const completeVerification = async (phone: string | null) => {
  const res = await publicFetch(
    `${API_BASE}/auth/register/complete-verification`,
    {
      method: 'POST',
      body: JSON.stringify({phone}),
    },
  );

  console.log('res', res);

  return res;
};

export const verifyTelegramCode = (
  data: z.infer<typeof verifyTelegramCodeSchema>,
) => {
  return publicFetch(`${API_BASE}/telegram/webhook/verify`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getRegisterStatus = async (phone: string) => {
  return publicFetch(
    `${API_BASE}/auth/mobile/register-status?phone=${encodeURIComponent(
      phone,
    )}`,
  );
};

// ─── مراحل لاگین (با auth) ──────────────────────────────────────────────────

export const login = async (data: z.infer<typeof loginSchema>) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({...data, platform: 'mobile'}),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw {
      message: responseData.message || 'خطا ناشناخته',
      code: responseData.code || 'UNKNOWN_ERROR',
    };
  }

  return responseData;
};

export const getCurrentUser = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  if (!token) throw new Error('NO_TOKEN');

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {Authorization: `Bearer ${token}`},
  });

  if (res.status === 401) {
    await AsyncStorage.removeItem('auth_token');
    throw new Error('UNAUTHORIZED');
  }

  if (!res.ok) throw new Error('SERVER_ERROR');

  return res.json();
};

export const multiStepProfile = async (data: MultiStepProfilePayload) => {
  console.log('data', data);
  return fetchWithAuth(`${API_BASE}/auth/register/completeProfile`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logoutApi = async () => {
  return fetchWithAuth(`${API_BASE}/auth/logout`, {
    method: 'POST',
    body: JSON.stringify({platform: 'mobile'}),
  });
};

export const getAllUsers = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  const res = await fetch(`${API_BASE}/users/all`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  if (!res.ok) throw new Error('خطا در دریافت کاربران');
  return res.json();
};
