import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchPublicProducts, startPayment } from '../../queries/product';
import { Linking, Alert } from 'react-native';

// دریافت لیست محصولات
export const usePublicProducts = () =>
  useQuery({
    queryKey: ['public-products'],
    queryFn: fetchPublicProducts,
    staleTime: 10 * 60 * 1000, // ۱۰ دقیقه
  });

// شروع پرداخت
export const useStartPayment = () =>
  useMutation({
    mutationFn: startPayment,
    onSuccess: (data) => {
      // data باید شامل paymentUrl باشد
      if (data?.paymentUrl) {
        Linking.openURL(data.paymentUrl).catch(() =>
          Alert.alert('خطا', 'باز کردن درگاه ممکن نیست'),
        );
      }
    },
    onError: (error: any) => {
      Alert.alert('خطا', error?.message || 'شروع پرداخت با مشکل مواجه شد');
    },
  });