import {Platform, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AcquisitionTouch {
  source: string;
  medium: string | null;
  campaign: string | null;
  campaignId: string | null;
  content: string | null;
  term: string | null;
  landingPage: string | null;
  referrer: string | null;
  referralCode: string | null;
  capturedAt: string;
}

const FIRST_TOUCH_KEY = 'yarsalam:acquisition:first-touch:v1';
const LAST_TOUCH_KEY = 'yarsalam:acquisition:last-touch:v1';

const sourceAliases: Record<string, string> = {
  google: 'google_organic',
  google_search: 'google_organic',
  google_ads: 'google_ads',
  adwords: 'google_ads',
  ig: 'instagram',
  chatgpt: 'chatgpt_search',
  openai: 'chatgpt_search',
  twitter: 'x',
  meta: 'facebook',
};

function safeString(value: string | null | undefined, max = 160): string | null {
  if (!value) return null;
  const cleaned = value.trim().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, max);
  return cleaned || null;
}

function hostOnly(value: string | null | undefined): string | null {
  const raw = safeString(value, 2048);
  if (!raw) return null;
  try {
    return new URL(raw).hostname.toLowerCase().replace(/^www\./, '').slice(0, 160);
  } catch {
    return null;
  }
}

function classifyReferrer(host: string | null): string | null {
  if (!host) return null;
  if (host === 'chatgpt.com' || host === 'chat.openai.com') return 'chatgpt_search';
  if (host === 'perplexity.ai' || host.endsWith('.perplexity.ai')) return 'perplexity';
  if (host === 'copilot.microsoft.com') return 'copilot';
  if (host === 'gemini.google.com') return 'gemini';
  if (host === 'claude.ai' || host.endsWith('.claude.ai')) return 'claude';
  if (host === 'google.com' || host.endsWith('.google.com')) return 'google_organic';
  if (host === 'bing.com' || host.endsWith('.bing.com')) return 'bing_organic';
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) return 'instagram';
  if (host === 't.me' || host === 'telegram.me' || host.endsWith('.telegram.org')) return 'telegram';
  if (host === 'whatsapp.com' || host.endsWith('.whatsapp.com')) return 'whatsapp';
  if (host === 'youtube.com' || host === 'youtu.be' || host.endsWith('.youtube.com')) return 'youtube';
  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) return 'tiktok';
  if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return 'linkedin';
  if (host === 'facebook.com' || host.endsWith('.facebook.com')) return 'facebook';
  if (host === 'x.com' || host === 'twitter.com') return 'x';
  if (host === 'bale.ai' || host.endsWith('.bale.ai')) return 'bale';
  return 'referral';
}

function touchFromUrl(rawUrl: string): AcquisitionTouch | null {
  try {
    const url = new URL(rawUrl);
    const params = url.searchParams;
    const referralCode = safeString(params.get('ref') || params.get('invite'), 96);
    const rawSource = safeString(params.get('utm_source') || params.get('source'), 80)?.toLowerCase() ?? null;
    const medium = safeString(params.get('utm_medium'), 80)?.toLowerCase() ?? null;
    let source = rawSource
      ? sourceAliases[rawSource] ?? rawSource.replace(/\s+/g, '_')
      : classifyReferrer(hostOnly(params.get('referrer'))) ?? 'unattributed';
    if (referralCode) source = 'referral';
    if (source === 'google_organic' && ['cpc', 'ppc', 'paid', 'paid_search'].includes(medium ?? '')) {
      source = 'google_ads';
    }

    return {
      source,
      medium,
      campaign: safeString(params.get('utm_campaign')),
      campaignId: safeString(params.get('utm_id'), 120),
      content: safeString(params.get('utm_content')),
      term: safeString(params.get('utm_term')),
      // Do not retain query strings or fragments: they may contain secrets or identifiers.
      landingPage: `${url.origin}${url.pathname.slice(0, 500)}`.slice(0, 600),
      referrer: hostOnly(params.get('referrer')),
      referralCode,
      capturedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function storeTouch(touch: AcquisitionTouch) {
  const [firstRaw] = await Promise.all([AsyncStorage.getItem(FIRST_TOUCH_KEY)]);
  if (!firstRaw) {
    await AsyncStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(touch));
  }
  await AsyncStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(touch));
}

async function captureInitialUrl() {
  const [firstRaw, initialUrl] = await Promise.all([
    AsyncStorage.getItem(FIRST_TOUCH_KEY),
    Linking.getInitialURL(),
  ]);
  if (!initialUrl) return;
  const touch = touchFromUrl(initialUrl);
  if (!touch) return;
  if (!firstRaw) await AsyncStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(touch));
  await AsyncStorage.setItem(LAST_TOUCH_KEY, JSON.stringify(touch));
}

/**
 * Capture the first launch/deep link once, then keep the latest tagged app
 * re-entry as last-touch. Attribution is optional and must never block startup.
 */
export function startAcquisitionTracking() {
  let active = true;
  const subscription = Linking.addEventListener('url', event => {
    const touch = touchFromUrl(event.url);
    if (touch && active) {
      void storeTouch(touch).catch(() => {
        if (__DEV__) console.warn('[acquisition] deep-link capture failed');
      });
    }
  });

  void captureInitialUrl().catch(() => {
    if (__DEV__) console.warn('[acquisition] initial-link capture failed');
  });

  return () => {
    active = false;
    subscription.remove();
  };
}

async function readStoredTouch(key: string): Promise<AcquisitionTouch | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<AcquisitionTouch>;
    if (typeof value.source !== 'string' || typeof value.capturedAt !== 'string') return null;
    return {
      source: value.source,
      medium: value.medium ?? null,
      campaign: value.campaign ?? null,
      campaignId: value.campaignId ?? null,
      content: value.content ?? null,
      term: value.term ?? null,
      landingPage: value.landingPage ?? null,
      referrer: value.referrer ?? null,
      referralCode: value.referralCode ?? null,
      capturedAt: value.capturedAt,
    };
  } catch {
    return null;
  }
}

export async function getAcquisitionData() {
  let firstTouch = await readStoredTouch(FIRST_TOUCH_KEY);
  let lastTouch = await readStoredTouch(LAST_TOUCH_KEY);

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    if (!firstTouch || !lastTouch) {
      try {
        await captureInitialUrl();
        firstTouch = await readStoredTouch(FIRST_TOUCH_KEY);
        lastTouch = await readStoredTouch(LAST_TOUCH_KEY);
      } catch {
        // Attribution failure is non-fatal to registration.
      }
    }
  } else {
    const runtime = globalThis as unknown as {
      location?: {search?: string; pathname?: string; origin?: string};
      localStorage?: {getItem: (key: string) => string | null};
      document?: {referrer?: string};
    };
    const params = new URLSearchParams(runtime.location?.search ?? '');
    const storedSource = runtime.localStorage?.getItem('acq_source');
    const storedReferral = runtime.localStorage?.getItem('referral_code');
    const webSource = storedSource || params.get('utm_source') || params.get('source');
    const referrer = hostOnly(runtime.document?.referrer);
    const source = webSource
      ? sourceAliases[webSource.toLowerCase()] ?? webSource.toLowerCase()
      : classifyReferrer(referrer) ?? (referrer ? 'referral' : 'direct');
    const webTouch: AcquisitionTouch = {
      source: storedReferral || params.get('ref') || params.get('invite') ? 'referral' : source,
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
      campaignId: params.get('utm_id'),
      content: params.get('utm_content'),
      term: params.get('utm_term'),
      landingPage: runtime.location
        ? `${runtime.location.origin ?? ''}${(runtime.location.pathname ?? '/').slice(0, 500)}`
        : null,
      referrer,
      referralCode: storedReferral || params.get('ref') || params.get('invite'),
      capturedAt: new Date().toISOString(),
    };
    const parseLocalTouch = (raw: string | null): AcquisitionTouch | null => {
      if (!raw) return null;
      try {
        const value = JSON.parse(raw) as Partial<AcquisitionTouch>;
        if (typeof value.source !== 'string' || typeof value.capturedAt !== 'string') return null;
        return {
          source: value.source,
          medium: value.medium ?? null,
          campaign: value.campaign ?? null,
          campaignId: value.campaignId ?? null,
          content: value.content ?? null,
          term: value.term ?? null,
          landingPage: value.landingPage ?? null,
          referrer: value.referrer ?? null,
          referralCode: value.referralCode ?? null,
          capturedAt: value.capturedAt,
        };
      } catch {
        return null;
      }
    };
    const localFirst = parseLocalTouch(runtime.localStorage?.getItem(FIRST_TOUCH_KEY) ?? null);
    const localLast = parseLocalTouch(runtime.localStorage?.getItem(LAST_TOUCH_KEY) ?? null);
    firstTouch = firstTouch ?? localFirst ?? webTouch;
    lastTouch = webTouch;
    try {
      if (!runtime.localStorage?.getItem(FIRST_TOUCH_KEY)) {
        runtime.localStorage?.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouch));
      }
      runtime.localStorage?.setItem(LAST_TOUCH_KEY, JSON.stringify(webTouch));
    } catch {
      // Browser storage may be unavailable (private mode / storage policy).
    }
  }

  const first = firstTouch ?? {
    source: 'unattributed',
    medium: null,
    campaign: null,
    campaignId: null,
    content: null,
    term: null,
    landingPage: null,
    referrer: null,
    referralCode: null,
    capturedAt: new Date().toISOString(),
  };

  return {
    acquisitionSource: first.source,
    acquisitionKeyword: first.term,
    referralCode: first.referralCode,
    acquisitionMeta: {
      campaign: first.campaign,
      campaignId: first.campaignId,
      medium: first.medium,
      landingPage: first.landingPage,
      referrer: first.referrer,
    },
    acquisition: {
      firstTouch: first,
      lastTouch: lastTouch ?? first,
    },
  };
}
