import {useMutation, useQueryClient} from '@tanstack/react-query';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';

export function useBuyWithWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bundleCode: string) =>
      fetchWithAuth(`/payments/buy/${encodeURIComponent(bundleCode)}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['wallet']});
      qc.invalidateQueries({queryKey: ['public-products']});
    },
  });
}
