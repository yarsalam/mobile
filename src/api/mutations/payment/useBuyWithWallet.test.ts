import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchWithAuth} from '../../../lib/fetchWithAuth';
import {buyWithWallet} from './useBuyWithWallet';

jest.mock('@react-native-async-storage/async-storage', () => {
  const values = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => values.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        values.set(key, value);
      }),
      removeItem: jest.fn(async (key: string) => {
        values.delete(key);
      }),
      clear: jest.fn(async () => values.clear()),
    },
  };
});

jest.mock('../../../lib/fetchWithAuth', () => ({
  fetchWithAuth: jest.fn(),
}));

const mockedFetch = fetchWithAuth as jest.MockedFunction<typeof fetchWithAuth>;

describe('buyWithWallet idempotency', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await (AsyncStorage as any).clear();
  });

  it('sends a persisted idempotency key and clears it after success', async () => {
    mockedFetch.mockResolvedValueOnce({success: true} as any);

    await buyWithWallet({bundleCode: 'vip-month', userId: 42});

    expect(mockedFetch).toHaveBeenCalledWith(
      '/payments/buy/vip-month',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Idempotency-Key': expect.stringMatching(/^ys-wallet-/),
        }),
      }),
    );
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      'yarsalam:pending-wallet-checkout:42:vip-month',
    );
  });

  it('sends the signed pricing quote with the wallet checkout', async () => {
    mockedFetch.mockResolvedValueOnce({success: true} as any);

    await buyWithWallet({
      bundleCode: 'vip-month',
      userId: 42,
      pricingQuoteId: 'signed.quote',
    });

    const options = mockedFetch.mock.calls[0][1] as any;
    expect(options.body).toBe(JSON.stringify({pricingQuoteId: 'signed.quote'}));
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers['Idempotency-Key']).toMatch(/^ys-wallet-/);
  });

  it('reuses the same key after a network failure and a retry', async () => {
    mockedFetch
      .mockRejectedValueOnce(new Error('network unavailable'))
      .mockResolvedValueOnce({success: true} as any);

    await expect(
      buyWithWallet({bundleCode: 'vip-month', userId: 42}),
    ).rejects.toThrow('network unavailable');

    const storageKey = 'yarsalam:pending-wallet-checkout:42:vip-month';
    const firstKey = await AsyncStorage.getItem(storageKey);
    expect(firstKey).toMatch(/^ys-wallet-/);

    await buyWithWallet({bundleCode: 'vip-month', userId: 42});

    const firstCallHeaders = (mockedFetch.mock.calls[0][1] as any).headers;
    const secondCallHeaders = (mockedFetch.mock.calls[1][1] as any).headers;
    expect(firstCallHeaders['Idempotency-Key']).toBe(firstKey);
    expect(secondCallHeaders['Idempotency-Key']).toBe(firstKey);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(storageKey);
  });

  it('retains the same key for an ambiguous 4xx after the server may have debited', async () => {
    const error = Object.assign(new Error('bundle fulfillment failed'), {
      status: 400,
      code: 'BUNDLE_FULFILLMENT_FAILED',
    });
    mockedFetch
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce({success: true} as any);

    await expect(
      buyWithWallet({bundleCode: 'vip-month', userId: 42}),
    ).rejects.toMatchObject({status: 400});

    const storageKey = 'yarsalam:pending-wallet-checkout:42:vip-month';
    const firstKey = await AsyncStorage.getItem(storageKey);
    expect(firstKey).toMatch(/^ys-wallet-/);

    await buyWithWallet({bundleCode: 'vip-month', userId: 42});

    const firstHeaders = (mockedFetch.mock.calls[0][1] as any).headers;
    const retryHeaders = (mockedFetch.mock.calls[1][1] as any).headers;
    expect(retryHeaders['Idempotency-Key']).toBe(firstHeaders['Idempotency-Key']);
    expect(retryHeaders['Idempotency-Key']).toBe(firstKey);
  });

  it('clears a pending key after a terminal client-side rejection', async () => {
    const error = Object.assign(new Error('insufficient balance'), {
      status: 400,
      code: 'INSUFFICIENT_BALANCE',
    });
    mockedFetch.mockRejectedValueOnce(error);

    await expect(
      buyWithWallet({bundleCode: 'vip-month', userId: 42}),
    ).rejects.toMatchObject({status: 400});

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      'yarsalam:pending-wallet-checkout:42:vip-month',
    );
  });

  it('coalesces concurrent callers for the same user and bundle', async () => {
    let resolveRequest: ((value: unknown) => void) | undefined;
    let markFetchStarted: (() => void) | undefined;
    const fetchStarted = new Promise<void>(resolve => {
      markFetchStarted = resolve;
    });
    mockedFetch.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveRequest = resolve;
          markFetchStarted?.();
        }) as any,
    );

    const first = buyWithWallet({bundleCode: 'vip-month', userId: 42});
    const second = buyWithWallet({bundleCode: 'vip-month', userId: 42});

    expect(second).toBe(first);
    await fetchStarted;
    expect(mockedFetch).toHaveBeenCalledTimes(1);

    resolveRequest?.({success: true});
    await expect(Promise.all([first, second])).resolves.toEqual([
      {success: true},
      {success: true},
    ]);
  });

});
