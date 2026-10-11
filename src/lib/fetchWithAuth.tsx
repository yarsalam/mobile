import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDeviceHeaders} from './deviceInfo';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const isFormData = options.body instanceof FormData;

  const authToken =
    (await AsyncStorage.getItem('auth_token')) ||
    (await AsyncStorage.getItem('temp_auth_token'));
  const deviceHeaders = await getDeviceHeaders();
  const headers: Record<string, string> = {
    ...(!isFormData ? {'Content-Type': 'application/json'} : {}),
    ...(options.headers as Record<string, string> | undefined),
    ...deviceHeaders,
    ...(authToken ? {Authorization: `Bearer ${authToken}`} : {}),
  };

  const response = await fetch(url, {...options, method, headers});

  if (response.status === 401) {
    if (url.includes('/auth/me')) {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('temp_auth_token');
    }
    throw new Error('UNAUTHORIZED');
  }

  const raw = await response.text();
  let parsed: any = null;

  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    if (!response.ok) throw new Error('خطا در سرور');
    return raw;
  }

  if (!response.ok) {
    const error = new Error(parsed?.message || 'خطا در سرور') as Error & {
      code?: string | null;
      status?: number;
    };
    error.code = parsed?.code || null;
    error.status = response.status;
    throw error;
  }

  return parsed;
};
