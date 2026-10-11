import {useMutation} from '@tanstack/react-query';
import {useToast} from '../../../context/ToastContext';
import {sendChangePhoneCode} from '../../queries/changePhone';

export function useSendChangePhoneMutation() {
  const {showToast} = useToast();

  return useMutation({
    mutationFn: ({
      phone,
      channel,
      otp,
    }: {
      phone: string;
      channel: 'telegram' | 'whatsapp';
      otp?: string;
    }) => sendChangePhoneCode(phone, channel, otp),
    onSuccess: () => {
      showToast('کد آماده است', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'ارسال کد با خطا مواجه شد', 'error');
    },
  });
}
