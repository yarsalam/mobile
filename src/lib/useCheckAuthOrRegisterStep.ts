import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {decodeToken} from './decodeToken';
import {useAuth} from '../context/AuthContext';
import {RootStackParamList} from '../../types/rootStackParamList';
import {getRegisterStatus} from '../api/auth/queries/auth';

export const useCheckAuthOrRegisterStep = () => {
  const {token, isAuthenticated, isAuthLoading} = useAuth();
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('Login');
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    let cancelled = false;
    const finish = (route: keyof RootStackParamList) => {
      if (cancelled) return;
      setInitialRoute(route);
      setHasChecked(true);
    };

    (async () => {
      if (isAuthenticated) {
        finish('UserPanel');
        return;
      }

      const phone = await AsyncStorage.getItem('registerPhone');
      if (!phone) {
        finish('Register');
        return;
      }

      if (token) {
        const decoded = decodeToken(token);
        const expiry = typeof decoded?.exp === 'number' ? decoded.exp * 1000 : 0;
        const expired = expiry <= Date.now();

        if (!expired && decoded?.temporary === true) {
          finish('multiStepProfile');
          return;
        }

        if (!expired && decoded && decoded.temporary !== true) {
          finish('Login');
          return;
        }

        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('temp_auth_token');
      }

      try {
        const status = await getRegisterStatus(phone);
        if (status?.isVerified && status?.isCompleted) {
          finish('Login');
        } else if (status?.isVerified) {
          finish('multiStepProfile');
        } else {
          finish('Register');
        }
      } catch {
        // Never leave the splash screen visible indefinitely when the API is down.
        finish('Login');
      }
    })().catch(() => finish('Login'));

    return () => {
      cancelled = true;
    };
  }, [token, isAuthenticated, isAuthLoading]);

  return {initialRoute, hasChecked};
};
