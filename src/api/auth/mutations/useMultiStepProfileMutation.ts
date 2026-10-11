import {useMutation} from '@tanstack/react-query';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../../types/rootStackParamList';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../../context/ToastContext';
import {multiStepProfile} from '../queries/auth';
import {useAuth} from '../../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useMultiStepProfileMutation() {
  const navigation = useNavigation<NavigationProp>();
  const {showToast} = useToast();
  const {setToken} = useAuth();
  return useMutation({
    mutationFn: multiStepProfile,
    onSuccess: async data => {
      if (data.token) {
        await setToken(data.token);
        await AsyncStorage.multiRemove([
          'registerStep',
          'multiStepProfile',
          'temp_auth_token',
        ]);
      }
      showToast('پروفایل شما با موفقیت ساخته شد', 'success');
      navigation.navigate('UserPanel');
    },
    onError: err => showToast(err.message, 'error'),
    
  });
}
