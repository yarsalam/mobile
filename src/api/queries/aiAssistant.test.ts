import {fetchWithAuth} from '../../lib/fetchWithAuth';
import {fetchSuggestReply} from './aiAssistant';

jest.mock('../../lib/fetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

const mockedFetch = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

describe('fetchSuggestReply', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetch.mockResolvedValue({reply: 'پاسخ پیشنهادی'} as any);
  });

  it('uses the existing target-user chat contract without requiring an assistant conversation ID', async () => {
    await fetchSuggestReply(undefined, 'آخرین پیام طرف مقابل', 27);

    expect(mockedFetch).toHaveBeenCalledWith('/ai-assistant/suggest-reply', {
      method: 'POST',
      body: JSON.stringify({
        convId: undefined,
        targetUserId: 27,
        message: 'آخرین پیام طرف مقابل',
      }),
    });
  });

  it('preserves the legacy assistant-conversation request shape', async () => {
    await fetchSuggestReply(12, 'یک پیام برای دستیار');

    expect(mockedFetch).toHaveBeenCalledWith('/ai-assistant/suggest-reply', {
      method: 'POST',
      body: JSON.stringify({
        convId: 12,
        targetUserId: undefined,
        message: 'یک پیام برای دستیار',
      }),
    });
  });
});
