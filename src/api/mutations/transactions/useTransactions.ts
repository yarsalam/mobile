import {useQuery} from '@tanstack/react-query';

export type Transaction = {
  userId: number;
  amount: number;
  paymentType: string;
  paymentDate: string;
  product: string;
  membershipEnd: string;
  trackingCode: string;
  status: 'success' | 'failed';
};

// The current backend has no authenticated transaction-history endpoint.
// Never display fabricated transactions as if they were real account data.
export const useTransactions = () =>
  useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      throw new Error('تاریخچه تراکنش‌ها هنوز در API بک‌اند پیاده‌سازی نشده است.');
    },
    retry: false,
  });
