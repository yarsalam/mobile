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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const queryClient = useQueryClient();

  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthLoading, setAuthLoading] = useState(true);

  // init token
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('auth_token');
      setTokenState(stored);
      setAuthLoading(false);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      console.log(
        'before logout →',
        await AsyncStorage.getItem('registerPhone'),
      );
    })();
  }, []);

  const decoded = useMemo(() => decodeToken(token || ''), [token]);
  const isPermanent = !!token && decoded?.temporary !== true;

  // 2) Fetch /me ONLY when permanent
  const {data: user, error} = useQuery<User>({
    queryKey: ['me'],
    queryFn: () => fetchWithAuth('http://192.168.0.133:5001/auth/me'),
    enabled: isPermanent,
    retry: false,
  });
  useEffect(() => {
    if (isPermanent && error) {
      (async () => {
        await AsyncStorage.removeItem('auth_token');
        setTokenState(null);
        queryClient.removeQueries({queryKey: ['me']});
      })();
    }
  }, [error, isPermanent, queryClient]);
  const isAuthenticated = Boolean(isPermanent && user);
  // 3) setToken
  const setToken = useCallback(
    async (newToken: string | null) => {
      if (newToken) {
        await AsyncStorage.setItem('auth_token', newToken);
        setTokenState(newToken);
        const d = decodeToken(newToken);
        if (d?.temporary !== true) {
          try {
            await queryClient.fetchQuery({
              queryKey: ['me'],
              queryFn: () => fetchWithAuth('http://192.168.0.133:5001/auth/me'),
            });
          } catch {
            await AsyncStorage.removeItem('auth_token');
            setTokenState(null);
          }
        }
      } else {
        await AsyncStorage.removeItem('auth_token');
        setTokenState(null);
        queryClient.removeQueries({queryKey: ['me']});
      }
    },
    [queryClient, token],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('auth_token');
    // 2. پاک کردن state
    setTokenState(null);

    // 3. پاک کردن cacheهای auth
    queryClient.removeQueries({queryKey: ['me']});
    queryClient.clear(); // (اختیاری ولی امن)
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAuthLoading,
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
