import { useMutation } from '@tanstack/react-query';
import { grantFreeBoost } from '../queries/boost';
import { useToast } from '../../context/ToastContext';

export const useBoostFreeMutation = (userId: number) => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () => grantFreeBoost(userId),
    onSuccess: () => {
      showToast('✅ بوست رایگان با موفقیت فعال شد!', 'success');
    },
    onError: (error: any) => {
      showToast(error?.message || '❌ خطا در فعال‌سازی بوست', 'error');
    },
  });
};