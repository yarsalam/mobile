import {useMutation, useQueryClient} from '@tanstack/react-query';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';

// Keep a failed request's key so a user retry after a lost response does not
// debit the wallet a second time. A successful purchase clears the key, making
// a later intentional purchase of the same bundle a new checkout.
const pendingCheckoutKeys = new Map<string, string>();

const getCheckoutKey = (bundleCode: string) => {
  const existing = pendingCheckoutKeys.get(bundleCode);
  if (existing) return existing;

  const key = `yarsalam-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  pendingCheckoutKeys.set(bundleCode, key);
  return key;
};

export function useBuyWithWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bundleCode: string) =>
      fetchWithAuth(`/payments/buy/${encodeURIComponent(bundleCode)}`, {
        method: 'POST',
        headers: {'Idempotency-Key': getCheckoutKey(bundleCode)},
      }),
    onSuccess: (_data, bundleCode) => {
      pendingCheckoutKeys.delete(bundleCode);
      qc.invalidateQueries({queryKey: ['wallet']});
      qc.invalidateQueries({queryKey: ['public-products']});
    },
  });
}
