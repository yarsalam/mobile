import {fetchWithAuth} from '../../lib/fetchWithAuth';
import {sendMessage} from './messages';

jest.mock('../../lib/fetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

const mockedFetch = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

describe('sendMessage moderation acknowledgement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetch.mockResolvedValue({id: 1} as any);
  });

  it('sends explicit acknowledgement only when the user accepted a medium warning', async () => {
    await sendMessage({
      to_id: 8,
      content: 'متن پیام',
      acceptModerationWarning: true,
    });

    expect(mockedFetch).toHaveBeenCalledWith('/messages', {
      method: 'POST',
      body: JSON.stringify({
        to_id: 8,
        content: 'متن پیام',
        acceptModerationWarning: true,
      }),
    });
  });

  it('does not send an acknowledgement by default', async () => {
    await sendMessage({to_id: 8, content: 'متن پیام'});

    expect(mockedFetch).toHaveBeenCalledWith('/messages', {
      method: 'POST',
      body: JSON.stringify({to_id: 8, content: 'متن پیام'}),
    });
  });
});
