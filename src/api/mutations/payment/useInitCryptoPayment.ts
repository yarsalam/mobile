import { useMutation } from '@tanstack/react-query';
import { initCryptoPayment } from '../../queries/payments';

export interface CryptoPaymentInitResult {
  paymentId: number;
  walletAddress: string;
  network: string;
  amount: number;
  currency: 'USDT';
  expiresAt: string;
}



export function useInitCryptoPayment() {
  return useMutation({
    mutationFn: initCryptoPayment,
    onSuccess: (data) => {
      console.log('Crypto payment initiated:', data);
    },
    onError: (error: any) => {
      console.error('Crypto payment failed:', error);
    },
  });
}