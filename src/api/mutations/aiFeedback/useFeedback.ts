import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../../queries/aiFeedback';
import { useAuth } from '../../../context/AuthContext';

// ارسال بازخورد
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.submitFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback-metrics'] });
    },
  });
};

// متریک‌های کلی
export const useFeedbackMetrics = () =>
  useQuery({
    queryKey: ['feedback-metrics'],
    queryFn: api.fetchFeedbackMetrics,
  });

// بینش تبدیل
export const useConversionInsights = (userId?: number) =>
  useQuery({
    queryKey: ['conversion-insights', userId],
    queryFn: () => api.fetchConversionInsights(userId),
  });

// ویژگی‌های برتر
export const useTopFeatures = () =>
  useQuery({
    queryKey: ['top-features'],
    queryFn: api.fetchTopPerformingFeatures,
  });

// هوک کمکی برای ارسال بازخورد در کامپوننت‌ها
export const useQuickFeedback = () => {
  const { user } = useAuth();
  const { mutate } = useSubmitFeedback();

  const send = (feature: string, value: any, extra?: any) => {
    if (!user) return;
    mutate({
      userId: user.id,
      feature,
      feedbackType: 'user_rating',
      value,
      source: 'in_app',
      ...extra,
    });
  };

  return { send };
};