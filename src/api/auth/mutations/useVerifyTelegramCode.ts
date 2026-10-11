import {useToast} from '../../../context/ToastContext';
import {verifyTelegramCode} from '../queries/auth';
import {useAuth} from '../../../context/AuthContext';
import {useMutation} from '@tanstack/react-query';

export function useVerifyTelegramCode() {
  const {showToast} = useToast();
  const {logout} = useAuth();

  return useMutation({
    mutationFn: verifyTelegramCode,
    onSuccess: async () => {
      await logout();
      showToast('کد تایید شد', 'success');
    },
    onError: () => {
      showToast('کد نامعتبر است', 'error');
    },
  });
}
