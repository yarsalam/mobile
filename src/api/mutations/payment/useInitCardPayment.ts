import {useMutation} from '@tanstack/react-query';
import {initCardPayment} from '../../queries/payments';

export interface CardPaymentInitResult {
  paymentId: number;
  cardNumber: string;
  accountHolder: string;
  amount: number;
  currency: 'IRT';
  expiresAt: string;
}

export function useInitCardPayment() {
  return useMutation({mutationFn: initCardPayment});
}
