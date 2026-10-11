import {useMutation} from '@tanstack/react-query';
import {useToast} from '../../../context/ToastContext';
import { saveWhatsAppOtp } from '../queries/auth';

export function useSaveWhatsAppMutation() {
  const {showToast} = useToast();

  return useMutation({
    mutationFn: saveWhatsAppOtp,
    onSuccess: () => {
      showToast('کد ثبت شد،در حال بررسی...', 'success');
    },
    onError: err => {
      showToast(err?.message || 'ثبت کد با خطا مواجه شد', 'error');
    },
  });
}
