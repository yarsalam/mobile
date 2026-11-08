import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useModerationCheck } from '../api/mutations/useModerationCheck';
import {getModerationDecision} from './moderationDecision';


interface UseModeratedSendOptions {
  receiverId: number;
  onSend: (text: string, acceptModerationWarning?: boolean) => void;
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

        const decision = getModerationDecision(result);
        if (decision === 'allow') {
          onSend(text, false);
        } else if (decision === 'confirm') {
          Alert.alert(
            'تأیید هشدار محتوایی',
            'این پیام دارای هشدار متوسط است. فقط در صورت اطمینان، مسئولیت ارسال آن را بپذیرید.',
            [
              {text: 'ویرایش', style: 'cancel'},
              {
                text: 'می‌پذیرم و ارسال می‌کنم',
                onPress: () => onSend(text, true),
                style: 'destructive',
              },
            ],
          );
        } else {
          Alert.alert(
            'پیام ارسال نشد',
            result?.data?.severity === 'high'
              ? 'این پیام به دلیل شدت بالای محتوای نامناسب قابل ارسال نیست.'
              : 'بررسی امنیتی کامل نشد؛ برای حفظ امنیت پیام ارسال نمی‌شود. لطفاً بعداً تلاش کنید.',
            [{text: 'ویرایش', style: 'cancel'}],
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