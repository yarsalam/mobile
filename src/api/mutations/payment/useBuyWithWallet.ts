import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';

export interface WalletPurchaseInput {
  bundleCode: string;
  userId: number;
}

const pendingKey = (userId: number, bundleCode: string) =>
  `yarsalam:pending-wallet-checkout:${userId}:${bundleCode}`;

const createIdempotencyKey = () =>
  `ys-wallet-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}';

/**
 * Keep one idempotency key per pending user+bundle checkout in persistent
 * storage. Network/5xx failures retain it so a retry (even after app restart)
 * replays the same purchase instead of debiting the wallet twice.
 */
export async function buyWithWallet({
  bundleCode,
  userId,
}: WalletPurchaseInput) {
  if (!Number.isSafeInteger(userId) || userId <= 0 || !bundleCode.trim()) {
    throw new Error('A valid user and bundle are required for wallet checkout');
  }

  const storageKey = pendingKey(userId, bundleCode);
  let idempotencyKey = await AsyncStorage.getItem(storageKey);

  if (!idempotencyKey) {
    idempotencyKey = createIdempotencyKey();
    await AsyncStorage.setItem(storageKey, idempotencyKey);
  }

  try {
    const result = await fetchWithAuth(
      `/payments/buy/${encodeURIComponent(bundleCode)}`,
      {
        method: 'POST',
        headers: {'Idempotency-Key': idempotencyKey},
      },
    );

    await AsyncStorage.removeItem(storageKey);
    return result;
  } catch (error) {
    const status = (error as {status?: number})?.status;
    // A client/business rejection did not complete this checkout. Clear the
    // key so a corrected/new attempt can start cleanly. Keep it for network
    // errors and server failures because the server may have committed work.
    if (typeof status === 'number' && status >= 400 && status < 500) {
      await AsyncStorage.removeItem(storageKey);
    }
    throw error;
  }
}

export function useBuyWithWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: buyWithWallet,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['wallet']});
      qc.invalidateQueries({queryKey: ['public-products']});
    },
  });
}
