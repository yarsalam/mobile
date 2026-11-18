import { useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '../../../lib/fetchWithAuth';

export interface ManualPromotionQuote {
  campaignId: string;
  bundleCode: string;
  currency: 'IRT';
  basePriceRials: number;
  discountRials: number;
  payablePriceRials: number;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  title: string;
  subtitle: string;
  expiresAt: string;
}

export const useManualPromotionQuote = (
  campaignId?: string,
  bundleCode?: string,
  enabled = true,
) =>
  useQuery<ManualPromotionQuote>({
    queryKey: ['manual-promotion-quote', campaignId, bundleCode],
    queryFn: () =>
      fetchWithAuth(
        '/promotions/manual/' +
          encodeURIComponent(campaignId!) +
          '/quote/' +
          encodeURIComponent(bundleCode!),
      ),
    enabled: Boolean(enabled && campaignId && bundleCode),
    staleTime: 15_000,
    retry: false,
  });
