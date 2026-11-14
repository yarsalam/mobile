import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking} from 'react-native';
import {getAcquisitionData} from './acquisition';

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
      clear: jest.fn(async () => {
        values.clear();
      }),
    },
  };
});

describe('acquisition touch capture', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('captures tagged deep links and strips query strings from landing pages', async () => {
    jest
      .spyOn(Linking, 'getInitialURL')
      .mockResolvedValue(
        'yarsalam://register?utm_source=google&utm_medium=cpc&utm_campaign=trust&utm_id=g-22&utm_term=security&token=private',
      );

    const data = await getAcquisitionData();

    expect(data.acquisitionSource).toBe('google_ads');
    expect(data.acquisitionKeyword).toBe('security');
    expect(data.acquisition.firstTouch.campaign).toBe('trust');
    expect(data.acquisition.firstTouch.campaignId).toBe('g-22');
    expect(data.acquisition.firstTouch.landingPage).not.toContain('token');
    expect(data.acquisition.firstTouch.landingPage).not.toContain('private');
  });

  it('records an unattributed first touch instead of guessing organic when no link is available', async () => {
    jest.spyOn(Linking, 'getInitialURL').mockResolvedValue(null);

    const first = await getAcquisitionData();

    expect(first.acquisitionSource).toBe('unattributed');
    expect(first.acquisition.firstTouch.source).toBe('unattributed');

    // Once an unknown first touch is persisted, it remains the immutable
    // acquisition anchor even if a later screen read sees a different URL.
    const second = await getAcquisitionData();
    expect(second.acquisition.firstTouch.source).toBe('unattributed');
  });
});
