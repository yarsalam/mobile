import { useMutation } from '@tanstack/react-query';
import { useToast } from '../../../context/ToastContext';
import { verifyChangePhoneCode } from '../../queries/changePhone';

export function useVerifyChangePhoneMutation() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({
      phone,
      code,
      channel,
    }: {
      phone: string;
      code?: string;
      channel: 'telegram' | 'whatsapp';
    }) => verifyChangePhoneCode(phone, code, channel),
    onSuccess: () => {
      showToast('شماره موبایل با موفقیت تغییر کرد', 'success');
    },
    onError: (err: any) => {
      showToast(err?.message || 'تأیید کد با خطا مواجه شد', 'error');
    },
  });
}