import {useMutation, useQueryClient} from '@tanstack/react-query';
import {submitProof} from '../../queries/payments';

// ✅ signature درست — object می‌گیره نه paymentId جدا
export function useSubmitProof() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: {paymentId: number; proofUrl: string}) =>
      submitProof(body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['payment', variables.paymentId],
      });
    },
  });
}
