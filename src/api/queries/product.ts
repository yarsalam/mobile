import {fetchWithAuth} from '../../lib/fetchWithAuth';

export interface PricingQuote {
  bundleCode: string;
  currency: 'IRT';
  basePriceRials: number;
  payablePriceRials: number;
  discountRials: number;
  discountBps: number;
  variant: 'control' | 'treatment' | null;
  experimentId: string | null;
  quoteId: string | null;
  eligibleForExperiment: boolean;
  expiresAt?: string;
}

// Active bundles are read from ProductBundle by the backend.
export const fetchPublicProducts = () => fetchWithAuth('/product/public');

export const fetchPricingQuote = (bundleCode: string) =>
  fetchWithAuth(
    `/product/quote/${encodeURIComponent(bundleCode)}`,
  ) as Promise<PricingQuote>;

// Record only after the quote has actually been rendered to the customer.
export const recordPricingExposure = (quoteId: string) =>
  fetchWithAuth('/product/pricing-exposure', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({quoteId}),
  });

// Purchases are made with wallet balance through POST /payments/buy/:bundleCode.
export const startPayment = (bundleCode: string) =>
  fetchWithAuth(`/payments/buy/${encodeURIComponent(bundleCode)}`, {
    method: 'POST',
  });

export const buyProductWithWallet = (
  bundleCode: string,
  pricingQuoteId?: string,
) =>
  fetchWithAuth(`/payments/buy/${encodeURIComponent(bundleCode)}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    ...(pricingQuoteId
      ? {body: JSON.stringify({pricingQuoteId})}
      : {}),
  });
