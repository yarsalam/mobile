import {useQuery} from '@tanstack/react-query';
import {fetchWithAuth} from '../../lib/fetchWithAuth';

const BASE = 'http://192.168.0.133:5001';

export interface WalletData {
  balance: number; // ریال خام
  balanceDisplay: string; // تومان با فرمت فارسی
  currency: 'IRT';
}

async function fetchWallet(): Promise<WalletData> {
  const res = await fetchWithAuth(`${BASE}/payments/wallet`);
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
