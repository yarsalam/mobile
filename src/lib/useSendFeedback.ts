import { useMutation } from '@tanstack/react-query';
import { fetchWithAuth } from './fetchWithAuth';


interface FeedbackData {
  notificationId: number;
  action: 'seen' | 'click' | 'ignored';
}

export const useSendFeedback = () => {
  return useMutation({
    mutationFn: async (data: FeedbackData) => {
      const response = await fetchWithAuth('/feedback', {
        method: 'POST',
        body: JSON.stringify({
          feature: 'notification',
          feedbackType: 'implicit',
          value: { action: data.action, notificationId: data.notificationId },
          context: { screen: 'home' }, // بعداً تغییر بده
        }),
      });
      return response;
    },
    onSuccess: (data) => {
      console.log('Feedback sent successfully', data);
    },
    onError: (error: any) => {
      console.warn('Feedback send failed', error.message || 'خطا در ارسال فیدبک');
    },
  });
};