import {useMutation} from '@tanstack/react-query';
import {useToast} from '../../../context/ToastContext';
import {completeVerification} from '../queries/auth';

export function useCompleteVerification() {
  const {showToast} = useToast();

  return useMutation({
    mutationFn: completeVerification,
    onSuccess: () => {
      showToast('شماره با موفقیت تایید شد', 'success');
    },
    onError: err => showToast(err?.message || 'تایید شماره انجام نشد', 'error'),
  });
}
