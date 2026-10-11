import { useMutation } from '@tanstack/react-query';
import { initCardPayment } from '../../queries/payments';

export interface CardPaymentInitResult {
  paymentId: number;
  cardNumber: string;
  accountHolder: string;
  amount: number;
  currency: 'IRT';
  expiresAt: string;
}



export function useInitCardPayment() {
  return useMutation({
    mutationFn: initCardPayment,
    onSuccess: (data) => {
      console.log('Card payment initiated:', data);
    },
    onError: (error: any) => {
      console.error('Card payment failed:', error);
    },
  });
}