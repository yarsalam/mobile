import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {decodeToken} from './decodeToken';
import {useAuth} from '../context/AuthContext';
import {useToast} from '../context/ToastContext';
import {RootStackParamList} from '../../types/rootStackParamList';
import {getRegisterStatus} from '../api/auth/queries/auth';

export const useCheckAuthOrRegisterStep = () => {
  const {token, isAuthenticated, isAuthLoading} = useAuth();
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('Login');
  const [hasChecked, setHasChecked] = useState(false);
  useEffect(() => {
    if (isAuthLoading) return;

    (async () => {
      // 1) Already authenticated (permanent token + /me succeeded) → UserPanel
      if (isAuthenticated) {
        setInitialRoute('UserPanel');
        setHasChecked(true);
        return;
      }

      const phone = await AsyncStorage.getItem('registerPhone');

      // 2) No phone ever registered on this device → Register
      if (!phone) {
        setInitialRoute('Register');
        setHasChecked(true);
        return;
      }

      // 3) Phone exists, token exists → decode it
      if (token) {
        const d = decodeToken(token);
        const expired = d.exp * 1000 < Date.now();

        if (!expired && d.temporary) {
          setInitialRoute('multiStepProfile');
          setHasChecked(true);
          return;
        }

        if (!d.temporary && !expired) {
          setInitialRoute('UserPanel');
          setHasChecked(true);
          return;
        }

        // expired token
        await AsyncStorage.removeItem('auth_token');
        setInitialRoute('Login');
        setHasChecked(true);
        return;
      }

      // 4) Phone exists, no token → this is the logged-out-user case
      const reg = await getRegisterStatus(phone);

      if (reg.isVerified && reg.isCompleted) {
        setInitialRoute('Login'); // ← was already correct here...
      } else if (reg.isVerified) {
        setInitialRoute('multiStepProfile');
      } else {
        setInitialRoute('Register');
      }
      setHasChecked(true);
    })();
  }, [token, isAuthenticated, isAuthLoading]);

  return {initialRoute, hasChecked};
};
