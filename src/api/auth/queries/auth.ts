import {
  registerStep1Schema,
  loginSchema,
  MultiStepProfilePayload,
  verifyTelegramCodeSchema,
} from '../../../schemas/authSchemas';
import {z} from 'zod';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';
import {getDeviceHeaders} from '../../../lib/deviceInfo';
import {API_BASE_URL} from '../../../config/api';

// Public requests still send device headers: registration verification uses them
// to bind verification to the device that initiated the flow.
async function publicFetch(url: string, options: RequestInit = {}) {
  const deviceHeaders = await getDeviceHeaders();
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  Object.entries(deviceHeaders).forEach(([key, value]) => headers.set(key, value));

  const res = await fetch(url, {...options, headers});
  const raw = await res.text();
  let data: any = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    if (!res.ok) throw {message: 'خطا در ارتباط با سرور', code: null};
    return raw;
  }

  if (!res.ok) {
    throw {
      message: data?.message || 'REQUEST_FAILED',
      code: data?.code || null,
      status: res.status,
    };
  }

  return data;
}

export const registerStep1 = (
  data: z.infer<typeof registerStep1Schema>,
) => {
  return publicFetch(`${API_BASE_URL}/auth/register/step1`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const saveWhatsAppOtp = (data: {phone: string; otp: string}) => {
  return publicFetch(`${API_BASE_URL}/auth/register/whatsapp/save-otp`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const verifyWhatsApp = (phone: string | null) => {
  return publicFetch(`${API_BASE_URL}/auth/register/whatsapp/verify`, {
    method: 'POST',
    body: JSON.stringify({phone}),
  });
};

export const completeVerification = (phone: string | null) => {
  return publicFetch(`${API_BASE_URL}/auth/register/complete-verification`, {
    method: 'POST',
    body: JSON.stringify({phone}),
  });
};

export const verifyTelegramCode = (
  data: z.infer<typeof verifyTelegramCodeSchema>,
) => {
  return publicFetch(`${API_BASE_URL}/telegram/webhook/verify`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getRegisterStatus = (phone: string) => {
  return publicFetch(
    `${API_BASE_URL}/auth/mobile/register-status?phone=${encodeURIComponent(phone)}`,
  );
};

export const login = (data: z.infer<typeof loginSchema>) => {
  return publicFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({...data, platform: 'mobile'}),
  });
};

export const getCurrentUser = () => {
  return fetchWithAuth(`${API_BASE_URL}/auth/me`);
};

export const multiStepProfile = (data: MultiStepProfilePayload) => {
  return fetchWithAuth(`${API_BASE_URL}/auth/register/completeProfile`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logoutApi = () => {
  return fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    body: JSON.stringify({platform: 'mobile'}),
  });
};

export const getAllUsers = () => {
  return fetchWithAuth(`${API_BASE_URL}/users/all`);
};
