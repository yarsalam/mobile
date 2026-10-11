import {useMutation} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useToast} from '../../context/ToastContext';
import {RootStackParamList} from '../../../types/rootStackParamList';
import {changePassword} from '../queries/changePassword';

export const useChangePassword = () => {
  const {showToast} = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return useMutation({
    mutationFn: (password: string) => changePassword(password),
    onSuccess: data => {
      showToast(data.message || 'رمز عبور با موفقیت تغییر یافت', 'success');
      navigation.goBack();
    },
    onError: (error: any) => {
      showToast(error?.message || 'خطا در تغییر رمز عبور', 'error');
    },
  });
};
