import {useMutation} from '@tanstack/react-query';
import {useToast} from '../../../context/ToastContext';
import {verifyWhatsApp} from '../queries/auth';

export function useVerifyWhatsAppMutation() {
  const {showToast} = useToast();

  return useMutation({
    mutationFn: verifyWhatsApp,
    onSuccess: (res: any) => {
      if (res?.verified) {
        showToast('پیام واتساپ تأیید شد', 'success');
      } else {
        showToast('در انتظار تأیید پیام', 'error');
      }
    },
    onError: err => {
      showToast(err?.message || 'بررسی پیام ناموفق بود', 'error');
    },
  });
}
