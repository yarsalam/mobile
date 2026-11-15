import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeToken} from '../lib/decodeToken';
import {fetchWithAuth} from '../lib/fetchWithAuth';
import {AuthContextType} from '../../types/authContextType';
import {User} from '../../types/userType';
import {API_BASE_URL} from '../config/api';
import {login as loginApi} from '../api/auth/queries/auth';
import {getDeviceHeaders} from '../lib/deviceInfo';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function syncAuthenticatedDevice(token: string): Promise<void> {
  try {
    const decoded = decodeToken(token);
    const userId = Number(decoded?.sub);
    if (!Number.isSafeInteger(userId) || userId <= 0) return;

    const deviceHeaders = await getDeviceHeaders();
    const response = await fetch(`${API_BASE_URL}/user-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...deviceHeaders,
      },
      body: JSON.stringify({
        userId,
        deviceId: deviceHeaders['X-Device-Id'],
        platform: 'mobile',
        brand: deviceHeaders['X-Brand'],
        model: deviceHeaders['X-Model'],
        osVersion: deviceHeaders['X-OS-Version'],
        appVersion: deviceHeaders['X-App-Version'],
        timezone: deviceHeaders['X-Timezone'],
      }),
    });

    if (!response.ok && __DEV__) {
      console.warn('[device-sync] metadata update rejected:', response.status);
    }
  } catch {
    // Device metadata is best-effort and must never block authentication.
    if (__DEV__) console.warn('[device-sync] metadata update failed');
  }
}

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem('auth_token')
      .then(stored => {
        if (mounted) setTokenState(stored);
      })
      .catch(() => {
        if (mounted) setTokenState(null);
      })
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const decoded = useMemo(() => decodeToken(token), [token]);
  const isPermanent = Boolean(token && decoded?.temporary !== true);

  const {data: user, error} = useQuery<User>({
    queryKey: ['me'],
    queryFn: () => fetchWithAuth(`${API_BASE_URL}/auth/me`),
    enabled: !isAuthLoading && isPermanent,
    retry: false,
  });

  useEffect(() => {
    if (!isPermanent || !error) return;

    let active = true;
    (async () => {
      await AsyncStorage.removeItem('auth_token');
      if (!active) return;
      setTokenState(null);
      queryClient.removeQueries({queryKey: ['me']});
    })().catch(() => {
      if (active) setTokenState(null);
    });

    return () => {
      active = false;
    };
  }, [error, isPermanent, queryClient]);

  const isAuthenticated = Boolean(isPermanent && user);

  // Run after /auth/me succeeds so this covers both a fresh login and a
  // previously stored session restored after an app restart or upgrade.
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    void syncAuthenticatedDevice(token);
  }, [isAuthenticated, token]);

  const setToken = useCallback(
    async (newToken: string | null) => {
      if (!newToken) {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('pending_notification_click_id');
        await AsyncStorage.removeItem('pending_notification_navigation');
        setTokenState(null);
        queryClient.removeQueries({queryKey: ['me']});
        return;
      }

      await AsyncStorage.setItem('auth_token', newToken);
      setTokenState(newToken);

      const decodedToken = decodeToken(newToken);
      if (decodedToken?.temporary === true) {
        queryClient.removeQueries({queryKey: ['me']});
        return;
      }

      try {
        await queryClient.fetchQuery({
          queryKey: ['me'],
          queryFn: () => fetchWithAuth(`${API_BASE_URL}/auth/me`),
          retry: false,
        });
      } catch {
        await AsyncStorage.removeItem('auth_token');
        setTokenState(null);
        queryClient.removeQueries({queryKey: ['me']});
      }
    },
    [queryClient],
  );

  const login = useCallback(
    async (credentials: any) => {
      const response = await loginApi(credentials);
      if (response?.token) await setToken(response.token);
      return response;
    },
    [setToken],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('temp_auth_token');
    await AsyncStorage.removeItem('pending_notification_click_id');
    await AsyncStorage.removeItem('pending_notification_navigation');
    setTokenState(null);
    queryClient.clear();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        token,
        isAuthenticated,
        isAuthLoading,
        login,
        setToken,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  }
  return context;
};
