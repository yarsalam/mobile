import {useMutation} from '@tanstack/react-query';
import {passUser} from '../queries/intractionsApi';
import {useToast} from '../../../context/ToastContext';

export const usePassMutation = (onSuccess?: () => void) => {
  const {showToast} = useToast();
  return useMutation({
    mutationFn: passUser,
    onSuccess: () => {
      showToast('رد شد', 'success');
      onSuccess?.();
    },
    onError: () => showToast('خطا در رد کردن', 'error'),
  });
};
