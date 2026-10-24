import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {fetchPublicProducts, startPayment} from '../../queries/product';
import {Alert} from 'react-native';

export const usePublicProducts = () =>
  useQuery({
    queryKey: ['public-products'],
    queryFn: fetchPublicProducts,
    staleTime: 10 * 60 * 1000,
  });

// Backend purchases the bundle with wallet balance; it does not return a paymentUrl.
export const useStartPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startPayment,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({queryKey: ['wallet']}),
        queryClient.invalidateQueries({queryKey: ['public-products']}),
      ]);
      Alert.alert('خرید', 'درخواست خرید با موفقیت ثبت شد.');
    },
    onError: (error: any) => {
      Alert.alert('خطا', error?.message || 'خرید با مشکل مواجه شد');
    },
  });
};
