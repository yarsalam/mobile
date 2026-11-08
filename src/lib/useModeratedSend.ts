import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useModerationCheck } from '../api/mutations/useModerationCheck';


interface UseModeratedSendOptions {
  receiverId: number;
  onSend: (text: string) => void;   // عملیات ارسال نهایی
}

export const useModeratedSend = ({ receiverId, onSend }: UseModeratedSendOptions) => {
  const [checking, setChecking] = useState(false);
  const moderationCheck = useModerationCheck();

  const sendWithModeration = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setChecking(true);
      try {
        const result = await moderationCheck.mutateAsync({
          text,
          receiverId,
        });

        if (result?.data?.allowed) {
          // امن → ارسال مستقیم
          onSend(text);
        } else {
          // خطرناک → هشدار
          Alert.alert(
            'هشدار محتوایی',
            `این پیام ممکن است مشکل‌دار باشد (شدت: ${result.data.severity}).\nآیا مطمئن هستید؟`,
            [
              { text: 'ویرایش', style: 'cancel' },
              {
                text: 'ارسال با ریسک',
                onPress: () => onSend(text),
                style: 'destructive',
              },
            ],
          );
        }
      } catch {
        // Fail closed: when moderation is unavailable, do not offer a client-side bypass.
        Alert.alert(
          'بررسی محتوا در دسترس نیست',
          'برای حفظ امنیت، پیام تا زمان موفقیت بررسی محتوا ارسال نمی‌شود. لطفاً بعداً دوباره تلاش کنید.',
          [{text: 'باشه'}],
        );
      } finally {
        setChecking(false);
      }
    },
    [receiverId, moderationCheck, onSend],
  );

  return { sendWithModeration, checking };
};