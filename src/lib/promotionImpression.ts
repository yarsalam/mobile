export type PromotionFeedItem = {
  id?: string | number;
  type?: string;
};

export function getVisiblePromotionId(
  feed: readonly PromotionFeedItem[],
  index: number,
): string | null {
  if (!Number.isInteger(index) || index < 0 || index >= feed.length) {
    return null;
  }

  const item = feed[index];
  if (item?.type !== 'promotion' || item.id === undefined || item.id === null) {
    return null;
  }

  const promotionId = String(item.id).trim();
  return promotionId.length > 0 ? promotionId : null;
}

/**
 * Records at most one successful impression request per promotion ID for the
 * lifetime of the feed hook. Concurrent click/dismiss requests share the same
 * pending promise, so the backend always receives impression before interaction.
 * Failed requests are removed from the cache and may be retried on visibility.
 */
export function createPromotionImpressionTracker(
  track: (promotionId: string) => Promise<unknown>,
): (promotionId: string) => Promise<unknown> {
  const requests = new Map<string, Promise<unknown>>();

  return (promotionId: string): Promise<unknown> => {
    const normalizedId = promotionId.trim();
    if (!normalizedId) {
      return Promise.reject(new Error('promotionId is required'));
    }

    const existing = requests.get(normalizedId);
    if (existing) return existing;

    const request = Promise.resolve()
      .then(() => track(normalizedId))
      .catch((error: unknown) => {
        requests.delete(normalizedId);
        throw error;
      });

    requests.set(normalizedId, request);
    return request;
  };
}
