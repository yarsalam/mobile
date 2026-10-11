import {useMutation} from '@tanstack/react-query';
import {reportUser} from '../queries/intractionsApi';
import {useToast} from '../../../context/ToastContext';

export const useReportMutation = () => {
  const {showToast} = useToast();
  return useMutation({
    mutationFn: ({
      reporterId,
      reportedUserId,
      reason,
    }: {
      reporterId: number;
      reportedUserId: number;
      reason: string;
    }) => reportUser(reporterId, reportedUserId, reason),
    onSuccess: () => showToast('گزارش ثبت شد', 'success'),
    onError: () => showToast('خطا در گزارش', 'error'),
  });
};
