import {fetchWithAuth} from '../../../lib/fetchWithAuth';
import {
  trackPromotionImpression,
  trackPromotionClick,
  dismissPromotion,
} from './intractionsApi';

jest.mock('../../../lib/fetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

const mockedFetch = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;
const promotionId = '550e8400-e29b-41d4-a716-446655440000';

describe('promotion exposure API contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('records a visible impression through the authenticated feed endpoint', async () => {
    mockedFetch.mockResolvedValueOnce({success: true} as any);
    await trackPromotionImpression(promotionId);

    expect(mockedFetch).toHaveBeenCalledWith(
      `/feed/impression/${promotionId}`,
      {method: 'POST'},
    );
  });

  it('records a promotion click through the authenticated feed endpoint', async () => {
    mockedFetch.mockResolvedValueOnce({success: true} as any);
    await trackPromotionClick(promotionId);

    expect(mockedFetch).toHaveBeenCalledWith(
      `/feed/click/${promotionId}`,
      {method: 'POST'},
    );
  });

  it('records a dismissal through the authenticated feed endpoint', async () => {
    mockedFetch.mockResolvedValueOnce({success: true} as any);
    await dismissPromotion(promotionId);

    expect(mockedFetch).toHaveBeenCalledWith(
      `/feed/dismiss/${promotionId}`,
      {method: 'POST'},
    );
  });
});
