import {useQuery} from '@tanstack/react-query';
import {fetchWithAuth} from '../../lib/fetchWithAuth';

export interface WalletData {
  balance: number; // raw rials
  balanceDisplay: string; // toman, Persian formatting
  currency: 'IRT';
}

async function fetchWallet(): Promise<WalletData> {
  const res = await fetchWithAuth('/payments/wallet');
  if (res?.data) return res.data;
  return res;
}

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: fetchWallet,
    staleTime: 30_000,
  });
}
