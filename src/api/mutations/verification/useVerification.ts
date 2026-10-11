import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestVerification, getVerificationStatus } from '../../queries/verification';
import { useToast } from '../../../context/ToastContext';

// درخواست تأیید
export const useRequestVerification = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: requestVerification,
    onSuccess: (data: any) => {
      if (data?.success) {
        showToast(data?.message || 'تأیید با موفقیت انجام شد', 'success');
        // به‌روزرسانی کش کاربر (تا isFaceVerified در profile تغییر کند)
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      } else {
        showToast(data?.message || 'تأیید ناموفق بود', 'error');
      }
    },
    onError: (error: any) => {
      showToast(error?.message || 'خطا در برقراری ارتباط', 'error');
    },
  });
};

// وضعیت تأیید
export const useVerificationStatus = () =>
  useQuery({
    queryKey: ['verificationStatus'],
    queryFn: getVerificationStatus,
    staleTime: 1000 * 60 * 5, // ۵ دقیقه
  });