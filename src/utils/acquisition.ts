import {Platform, Linking} from 'react-native';

export async function getAcquisitionData() {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    try {
      const url = await Linking.getInitialURL();
      if (url) {
        const parsedUrl = new URL(url);
        const params = parsedUrl.searchParams;
        return {
          acquisitionSource: params.get('utm_source') || 'mobile',
          acquisitionKeyword: params.get('utm_term') || null,
          referralCode: params.get('ref') || params.get('invite') || null,
          acquisitionMeta: {
            campaign: params.get('utm_campaign') || null,
            medium: params.get('utm_medium') || null,
            landingPage: url,
            referrer: null,
          },
        };
      }
    } catch {}

    return {
      acquisitionSource: 'mobile',
      acquisitionKeyword: null,
      referralCode: null,
      acquisitionMeta: {
        campaign: null,
        medium: null,
        landingPage: 'app',
        referrer: null,
      },
    };
  }

  // This module is bundled for React Native. Access optional web globals
  // through a typed runtime shape so native TypeScript builds don't require DOM.
  const runtime = globalThis as unknown as {
    location?: {search?: string; pathname?: string};
    localStorage?: {getItem: (key: string) => string | null};
    document?: {referrer?: string};
  };
  const urlParams = new URLSearchParams(runtime.location?.search ?? '');
  const storedSource = runtime.localStorage?.getItem('acq_source');
  const storedReferral = runtime.localStorage?.getItem('referral_code');

  return {
    acquisitionSource:
      storedSource ||
      urlParams.get('utm_source') ||
      urlParams.get('source') ||
      'direct',
    acquisitionKeyword: urlParams.get('utm_term') || null,
    referralCode:
      urlParams.get('ref') ||
      urlParams.get('invite') ||
      storedReferral ||
      null,
    acquisitionMeta: {
      campaign: urlParams.get('utm_campaign') || null,
      medium: urlParams.get('utm_medium') || null,
      landingPage: runtime.location?.pathname || 'app',
      referrer: runtime.document?.referrer || 'direct',
    },
  };
}
