import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {useInitCardPayment} from '../../api/mutations/payment/useInitCardPayment';
import {useInitCryptoPayment} from '../../api/mutations/payment/useInitCryptoPayment';
import {usePublicProducts} from '../../api/mutations/product/useProducts';
import CardPaymentSheet from '../../components/CardPaymentSheet/CardPaymentSheet';
import CryptoPaymentSheet from '../../components/CardPaymentSheet/CryptoPaymentSheet';

type Method = 'card' | 'crypto';

export default function PaymentMethod() {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const {productId} = route.params as {productId: string};

  const [method, setMethod] = useState<Method | null>(null);
  const {data: productGroups, isLoading: productsLoading} = usePublicProducts();
  const products = [
    ...(productGroups?.boost ?? []),
    ...(productGroups?.credits ?? []),
    ...(productGroups?.vip ?? []),
  ];
  const product = products.find((item: any) => String(item.id) === String(productId));
  const amountRials = Number(product?.price);
  const amountToman = Number(product?.priceToman ?? amountRials / 10);

  const cardMutation = useInitCardPayment();
  const cryptoMutation = useInitCryptoPayment();
  const isLoading = productsLoading || cardMutation.isPending || cryptoMutation.isPending;
  const [cardResult, setCardResult] = useState<any>(null);
  const [cryptoResult, setCryptoResult] = useState<any>(null);

  const handleSelectMethod = async (selected: Method) => {
    setMethod(selected);
    if (!product || !Number.isFinite(amountRials) || amountRials <= 0) {
      Alert.alert('خطا', 'محصول در فهرست فعال بک‌اند پیدا نشد.');
      return;
    }

    try {
      const result = selected === 'card'
        ? await cardMutation.mutateAsync({amountRials})
        : await cryptoMutation.mutateAsync({amountRials});
      if (selected === 'card') setCardResult(result?.data ?? result);
      else setCryptoResult(result?.data ?? result);
    } catch (error: any) {
      Alert.alert('خطا', error?.message || 'مشکلی پیش آمد. دوباره تلاش کنید.');
      setMethod(null);
    }
  };

  if (cardResult) return <CardPaymentSheet data={cardResult} onClose={() => navigation.goBack()} />;
  if (cryptoResult) return <CryptoPaymentSheet data={cryptoResult} onClose={() => navigation.goBack()} />;

  return (
    <MainLayout>
      <SectionWithLine text="روش پرداخت" />
      {product ? (
        <GlobalText style={styles.amount}>
          {product.label} — مبلغ: {amountToman.toLocaleString('fa-IR')} تومان
        </GlobalText>
      ) : !productsLoading ? (
        <GlobalText style={styles.amount}>محصول فعال پیدا نشد.</GlobalText>
      ) : null}

      {isLoading ? (
        <ActivityIndicator color={theme.colors.primary} style={{marginTop: 40}} />
      ) : (
        <View style={styles.methods}>
          <TouchableOpacity style={styles.method} onPress={() => handleSelectMethod('card')}>
            <GlobalText style={styles.methodIcon}>💳</GlobalText>
            <GlobalText style={styles.methodTitle}>کارت به کارت</GlobalText>
            <GlobalText style={styles.methodDesc}>واریز به شماره کارت و آپلود رسید</GlobalText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.method} onPress={() => handleSelectMethod('crypto')}>
            <GlobalText style={styles.methodIcon}>🪙</GlobalText>
            <GlobalText style={styles.methodTitle}>USDT (TRC20)</GlobalText>
            <GlobalText style={styles.methodDesc}>پرداخت با تتر — بدون نیاز به درگاه ایرانی</GlobalText>
          </TouchableOpacity>
        </View>
      )}
    </MainLayout>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    amount: {textAlign: 'center', fontSize: 18, color: theme.colors.text, marginTop: 24, marginBottom: 8},
    methods: {padding: 16, gap: 16, marginTop: 16},
    method: {backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center'},
    methodIcon: {fontSize: 30, marginBottom: 8},
    methodTitle: {fontSize: 16, color: theme.colors.text, marginBottom: 4},
    methodDesc: {fontSize: 13, color: theme.colors.text, opacity: 0.7, textAlign: 'center'},
  });
