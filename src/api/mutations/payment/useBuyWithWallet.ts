import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';

export interface WalletPurchaseInput {
  bundleCode: string;
  userId: number;
  promotionId?: string;
}

const pendingKey = (userId: number, bundleCode: string) =>
  `yarsalam:pending-wallet-checkout:${userId}:${bundleCode}`;
const pendingPromotionKey = (userId: number, bundleCode: string) =>
  `${pendingKey(userId, bundleCode)}:promotion`;

const createIdempotencyKey = () =>
  `ys-wallet-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;

const PROMOTION_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Persist both the idempotency key and its original promotion attribution.
 * An ambiguous retry must replay the exact original body: it must never attach
 * a newer promotion ID to a purchase request that may already have debited.
 */
const inFlightWalletCheckouts = new Map<string, Promise<unknown>>();

async function performWalletPurchase({
  bundleCode,
  userId,
  promotionId,
}: WalletPurchaseInput) {
  const storageKey = pendingKey(userId, bundleCode);
  const promotionStorageKey = pendingPromotionKey(userId, bundleCode);
  let idempotencyKey = await AsyncStorage.getItem(storageKey);

  if (!idempotencyKey) {
    idempotencyKey = createIdempotencyKey();
    await AsyncStorage.setItem(storageKey, idempotencyKey);
    if (promotionId) {
      await AsyncStorage.setItem(promotionStorageKey, promotionId);
    } else {
      await AsyncStorage.removeItem(promotionStorageKey);
    }
  }

  // For an existing checkout, use only the attribution saved with its key.
  // A legacy pending key without this value is replayed without attribution.
  const originalPromotionId = await AsyncStorage.getItem(promotionStorageKey);

  try {
    const result = await fetchWithAuth(
      `/payments/buy/${encodeURIComponent(bundleCode)}`,
      {
        method: 'POST',
        headers: {'Idempotency-Key': idempotencyKey},
        ...(originalPromotionId
          ? {body: JSON.stringify({promotionId: originalPromotionId})}
          : {}),
      },
    );

    await AsyncStorage.removeItem(storageKey);
    await AsyncStorage.removeItem(promotionStorageKey);
    return result;
  } catch (error) {
    const code = (error as {code?: string})?.code;
    // Only this explicit backend code proves that no wallet debit occurred.
    // Keep both values for ambiguous failures so retry is byte-for-byte aligned.
    if (code === 'INSUFFICIENT_BALANCE') {
      await AsyncStorage.removeItem(storageKey);
      await AsyncStorage.removeItem(promotionStorageKey);
    }
    throw error;
  }
}

/**
 * Coalesce simultaneous taps/callers for the same user+bundle in this app
 * process. After a failure the in-flight entry is removed, while the persisted
 * checkout key and its promotion context remain available to the next retry.
 */
export function buyWithWallet(input: WalletPurchaseInput) {
  const {bundleCode, userId, promotionId} = input;
  if (!Number.isSafeInteger(userId) || userId <= 0 || !bundleCode.trim()) {
    return Promise.reject(
      new Error('A valid user and bundle are required for wallet checkout'),
    );
  }
  if (promotionId && !PROMOTION_ID_PATTERN.test(promotionId)) {
    return Promise.reject(new Error('A valid promotion exposure ID is required'));
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
