import {useMutation} from '@tanstack/react-query';
import {useToast} from '../../../context/ToastContext';
import {login} from '../queries/auth';
import {useAuth} from '../../../context/AuthContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../../types/rootStackParamList';
import {useNavigation} from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export function useLoginMutation() {
  const {showToast} = useToast();
  const {setToken} = useAuth();
  const navigation = useNavigation<NavigationProp>();

  return useMutation({
    mutationFn: login,
    onSuccess: async data => {
      await setToken(data.token); // ✅ مهم
      showToast('به یارسلام خوش آمدید', 'success');
    },
    onError: (err: any) => {
      if (err.message === 'برای این کاربر رمز ثبت نشده است') {
        showToast(
          'پروفایل شما تکمیل نشده است.از طریق فرم زیر ثبت نام کنید',
          'error',
        );

        navigation.navigate('Register');

        return;
      }
      showToast('خطا در ورود', 'error');
    },
  });
}
