import { describe, expect, it, jest } from '@jest/globals';
import { trackPromotionClickInBackground } from './promotionAnalytics';

describe('promotion analytics navigation isolation', () => {
  it('starts click tracking and returns immediately without a promise', () => {
    const track = jest.fn<(promotionId: string) => Promise<void>>()
      .mockResolvedValue(undefined);

    const result = trackPromotionClickInBackground(track, 'promotion-1');

    expect(result).toBeUndefined();
    expect(track).toHaveBeenCalledWith('promotion-1');
  });

  it('swallows asynchronous analytics failures', async () => {
    const track = jest.fn<(promotionId: string) => Promise<void>>()
      .mockRejectedValue(new Error('network unavailable'));

    expect(() =>
      trackPromotionClickInBackground(track, 'promotion-2'),
    ).not.toThrow();

    await Promise.resolve();
    expect(track).toHaveBeenCalledWith('promotion-2');
  });

  it('swallows synchronous analytics adapter failures', () => {
    const track = jest.fn<(promotionId: string) => Promise<void>>(() => {
      throw new Error('adapter unavailable');
    });

    expect(() =>
      trackPromotionClickInBackground(track, 'promotion-3'),
    ).not.toThrow();
  });
});
