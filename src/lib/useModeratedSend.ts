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
      } catch (error) {
        // خطای شبکه → پرسش از کاربر
        Alert.alert('خطا', 'بررسی محتوا ممکن نیست. همچنان ارسال شود؟', [
          { text: 'لغو' },
          { text: 'بله', onPress: () => onSend(text) },
        ]);
      } finally {
        setChecking(false);
      }
    },
    [receiverId, moderationCheck, onSend],
  );

  return { sendWithModeration, checking };
};