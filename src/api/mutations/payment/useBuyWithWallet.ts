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
  `ys-wallet-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;

/**
 * Keep one idempotency key per pending user+bundle checkout in persistent
 * storage. Network/5xx failures retain it so a retry (even after app restart)
 * replays the same purchase instead of debiting the wallet twice.
 */
const inFlightWalletCheckouts = new Map<string, Promise<unknown>>();

async function performWalletPurchase({bundleCode, userId}: WalletPurchaseInput) {
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
    const code = (error as {code?: string})?.code;
    // Only this explicit backend code proves that no wallet debit occurred.
    // Keep the key for ambiguous failures so retry cannot debit a second time.
    if (code === 'INSUFFICIENT_BALANCE') {
      await AsyncStorage.removeItem(storageKey);
    }
    throw error;
  }
}

/**
 * Coalesce simultaneous taps/callers for the same user+bundle in this app
 * process. After a failure the in-flight entry is removed, while the persisted
 * idempotency key remains available to the next retry.
 */
export function buyWithWallet(input: WalletPurchaseInput) {
  const {bundleCode, userId} = input;
  if (!Number.isSafeInteger(userId) || userId <= 0 || !bundleCode.trim()) {
    return Promise.reject(
      new Error('A valid user and bundle are required for wallet checkout'),
    );
  }

  const storageKey = pendingKey(userId, bundleCode);
  const active = inFlightWalletCheckouts.get(storageKey);
  if (active) return active;

  const request = performWalletPurchase(input);
  inFlightWalletCheckouts.set(storageKey, request);
  const clearInFlight = () => {
    if (inFlightWalletCheckouts.get(storageKey) === request) {
      inFlightWalletCheckouts.delete(storageKey);
    }
  };
  request.then(clearInFlight, clearInFlight);

  return request;
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
