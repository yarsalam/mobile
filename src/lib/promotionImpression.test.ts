import { describe, expect, it, jest } from '@jest/globals';
import {
  createPromotionImpressionTracker,
  getVisiblePromotionId,
} from './promotionImpression';

describe('promotion impression lifecycle', () => {
  it('detects the initially visible promotion card', () => {
    const feed = [
      { type: 'promotion', id: 'promo-first' },
      { type: 'user', id: 'user-2' },
    ];

    expect(getVisiblePromotionId(feed, 0)).toBe('promo-first');
  });

  it('detects a promotion when scrolling makes it the active card', () => {
    const feed = [
      { type: 'user', id: 'user-1' },
      { type: 'promotion', id: 'promo-after-scroll' },
    ];

    expect(getVisiblePromotionId(feed, 1)).toBe('promo-after-scroll');
  });

  it('does not record user cards or out-of-range indices as impressions', () => {
    const feed = [{ type: 'user', id: 'user-1' }];

    expect(getVisiblePromotionId(feed, 0)).toBeNull();
    expect(getVisiblePromotionId(feed, -1)).toBeNull();
    expect(getVisiblePromotionId(feed, 1)).toBeNull();
  });

  it('shares an in-flight request and reuses a successful impression', async () => {
    let resolveRequest: ((value: unknown) => void) | undefined;
    const track = jest.fn(
      () =>
        new Promise<unknown>(resolve => {
          resolveRequest = resolve;
        }),
    );
    const recordImpression = createPromotionImpressionTracker(track);

    const first = recordImpression('promo-1');
    const concurrent = recordImpression('promo-1');
    expect(track).toHaveBeenCalledTimes(0);

    await Promise.resolve();
    expect(track).toHaveBeenCalledTimes(1);

    resolveRequest?.({ success: true });
    await Promise.all([first, concurrent]);
    await recordImpression('promo-1');

    expect(track).toHaveBeenCalledTimes(1);
  });

  it('allows retry after an impression request fails', async () => {
    const track = jest
      .fn<(promotionId: string) => Promise<void>>()
      .mockRejectedValueOnce(new Error('temporary network failure'))
      .mockResolvedValueOnce(undefined);
    const recordImpression = createPromotionImpressionTracker(track);

    await expect(recordImpression('promo-retry')).rejects.toThrow(
      'temporary network failure',
    );
    await expect(recordImpression('promo-retry')).resolves.toBeUndefined();

    expect(track).toHaveBeenCalledTimes(2);
  });
});
