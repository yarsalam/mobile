import { useMutation } from '@tanstack/react-query';
import { useToast } from '../../context/ToastContext';
import { checkMessage } from '../queries/moderation';


export const useModerationCheck = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (params: { text: string; receiverId: number }) =>
      checkMessage(params.text, params.receiverId),
    onError: () => {
      // ممکن است سرویس در دسترس نباشد، می‌توانیم پیام را با هشدار ارسال کنیم
    },
  });
};