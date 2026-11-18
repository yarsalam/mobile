/**
 * Starts promotion analytics without coupling user navigation to network I/O.
 * The backend already records impressions when it assembles the feed.
 */
export function trackPromotionClickInBackground(
  track: (promotionId: string) => Promise<unknown>,
  promotionId: string,
): void {
  try {
    void track(promotionId).catch(() => undefined);
  } catch {
    // A synchronous analytics adapter failure must not block navigation either.
  }
}
