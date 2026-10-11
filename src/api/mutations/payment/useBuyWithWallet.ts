import {useMutation, useQueryClient} from '@tanstack/react-query';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

const BASE = 'http://192.168.0.133:5001';

export function useBuyWithWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bundleCode: string) => {
      const res = await fetchWithAuth(`${BASE}/payments/buy/${bundleCode}`, {
        method: 'POST',
      });
      return res;
    },
    onSuccess: () => {
      // موجودی wallet و محصولات کاربر رو refresh کن
      qc.invalidateQueries({queryKey: ['wallet']});
      qc.invalidateQueries({queryKey: ['public-products']});
    },
  });
}
