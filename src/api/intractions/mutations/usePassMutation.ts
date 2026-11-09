import {useMutation} from '@tanstack/react-query';
import {passUser} from '../queries/intractionsApi';
import {useToast} from '../../../context/ToastContext';

export const usePassMutation = (onSuccess?: (userId: number) => void) => {
  const {showToast} = useToast();
  return useMutation({
    mutationFn: passUser,
    onSuccess: (_, userId) => {
      showToast('رد شد', 'success');
      onSuccess?.(userId);
    },
    onError: () => showToast('خطا در رد کردن', 'error'),
  });
};
