import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useModerationCheck } from '../api/mutations/useModerationCheck';

interface UseModeratedSendOptions {
  receiverId: number;
  onSend: (text: string, acknowledged?: boolean) => void;
}

export const useModeratedSend = ({ receiverId, onSend }: UseModeratedSendOptions) => {
  const [checking, setChecking] = useState(false);
  const moderationCheck = useModerationCheck();

  const sendWithModeration = useCallback(
    async (text: string) => {
      if (!text.trim() || checking) return;

      setChecking(true);
      try {
        const result = await moderationCheck.mutateAsync({ text, receiverId });
        const data = result?.data?.data ?? result?.data ?? result;
        const severity = data?.severity;

        if (data?.allowed === true) {
          onSend(text, false);
          return;
        }

        if (severity === 'medium') {
          Alert.alert(
            'هشدار محتوایی',
            'این پیام نیازمند تأیید آگاهانه شماست. مسئولیت ارسال پیام پس از پذیرش هشدار با شماست.',
            [
              { text: 'ویرایش', style: 'cancel' },
              {
                text: 'می‌پذیرم و ارسال می‌کنم',
                onPress: () => onSend(text, true),
                style: 'destructive',
              },
            ],
          );
          return;
        }

        const message =
          severity === 'high' || severity === 'critical'
            ? 'این پیام به دلیل محتوای پرخطر قابل ارسال نیست. متن را ویرایش کنید.'
            : 'بررسی امنیتی موقتاً در دسترس نیست؛ پیام ارسال نشد. بعداً دوباره تلاش کنید.';

        Alert.alert('ارسال پیام ممکن نیست', message, [
          { text: 'ویرایش', style: 'cancel' },
        ]);
      } catch {
        Alert.alert(
          'بررسی امنیتی ناموفق بود',
          'به دلیل ناموفق بودن بررسی محتوا، پیام ارسال نشد. پس از برقراری سرویس دوباره تلاش کنید.',
          [{ text: 'باشه', style: 'cancel' }],
        );
      } finally {
        setChecking(false);
      }
    },
    [receiverId, moderationCheck, onSend, checking],
  );

  return { sendWithModeration, checking };
};
