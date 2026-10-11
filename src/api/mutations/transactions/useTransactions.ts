import { useQuery } from '@tanstack/react-query';
import { useToast } from '../../../context/ToastContext';


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

// داده‌های فیک (مثل نسخه وب)
const fakeTransactions: Transaction[] = [
  {
    userId: 101,
    amount: 250010,
    paymentType: 'کارت به کارت',
    paymentDate: '1403/02/07',
    product: 'اشتراک طلایی',
    membershipEnd: '1403/05/07',
    trackingCode: '7890',
    status: 'success',
  },
  {
    userId: 102,
    amount: 150010,
    paymentType: 'درگاه پرداخت',
    paymentDate: '1403/02/05',
    product: 'اشتراک نقره‌ای',
    membershipEnd: '1403/04/05',
    trackingCode: '1234',
    status: 'failed',
  },
];

export const useTransactions = () => {
  const { showToast } = useToast();

  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => {
      return new Promise<Transaction[]>((resolve) => {
        setTimeout(() => {
          showToast('لیست تراکنش‌ها با موفقیت دریافت شد', 'success');
          resolve(fakeTransactions);
        }, 500); // تأخیر شبیه‌سازی شده
      });
    },
    onError: () => {
      showToast('خطا در دریافت تراکنش‌ها', 'error');
    },
  });
};
