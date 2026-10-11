import {useMutation} from '@tanstack/react-query';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../../types/rootStackParamList';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../../context/ToastContext';
import {registerStep1} from '../queries/auth';
import {
  saveRegisterPhone,
  saveRegisterStep,
} from '../../../lib/useRegisterStorage';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useRegisterStep1Mutation() {
  const navigation = useNavigation<NavigationProp>();
  const {showToast} = useToast();

  return useMutation({
    mutationFn: registerStep1,
    onSuccess: async (_, variables) => {
      await saveRegisterPhone(variables.phone);
      await saveRegisterStep(2);
      navigation.navigate('SelectChannel');
    },
    onError: err => {
      const errorMessage = err?.message || '';
      if (
        err.message === 'این شماره قبلاً ثبت‌نام کرده.' ||
        err.code === 'EXISTING_USER'
      ) {
        showToast('این شماره ثبت شده است. از طریق فرم زیر وارد شوید', 'error');

        navigation.navigate('Login', {
          error: 'USER_EXISTS',
        });

        return;
      }

      showToast(errorMessage, 'error');
    },
  });
}
