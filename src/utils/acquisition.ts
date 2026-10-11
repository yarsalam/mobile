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

  // اینجا یه } کم بود
  const urlParams = new URLSearchParams(window.location.search);
  return {
    acquisitionSource:
      localStorage.getItem('acq_source') ||
      urlParams.get('utm_source') ||
      urlParams.get('source') ||
      'direct',
    acquisitionKeyword: urlParams.get('utm_term') || null,
    referralCode:
      urlParams.get('ref') ||
      urlParams.get('invite') ||
      localStorage.getItem('referral_code') ||
      null,
    acquisitionMeta: {
      campaign: urlParams.get('utm_campaign') || null,
      medium: urlParams.get('utm_medium') || null,
      landingPage: window.location.pathname,
      referrer: document.referrer || 'direct',
    },
  };
}
