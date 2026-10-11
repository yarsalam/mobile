import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import { useTheme } from '../../context/MainContext';
import { useInitCardPayment } from '../../api/mutations/payment/useInitCardPayment';
import { useInitCryptoPayment } from '../../api/mutations/payment/useInitCryptoPayment';
import CardPaymentSheet from '../../components/CardPaymentSheet/CardPaymentSheet';
import CryptoPaymentSheet from '../../components/CardPaymentSheet/CryptoPaymentSheet';


// Legacy productId-to-price mapping. Keep aligned with backend bundle prices;
// the backend deposit endpoints accept amountRials and handle crypto conversion.
const PRODUCT_PRICES: Record<string, { rials: number; cents: number; code: string }> = {
  boost_1:        { rials: 19000,  cents: 100, code: 'boost_1' },
  boost_5:        { rials: 89000,  cents: 500, code: 'boost_5' },
  boost_10:       { rials: 169000, cents: 950, code: 'boost_10' },
  credits_10:     { rials: 19000,  cents: 100, code: 'credits_10' },
  credits_50:     { rials: 89000,  cents: 500, code: 'credits_50' },
  credits_100:    { rials: 169000, cents: 950, code: 'credits_100' },
  vip_month:      { rials: 19000,  cents: 100, code: 'vip_month' },
  vip_3month:     { rials: 89000,  cents: 500, code: 'vip_3month' },
  vip_1year:      { rials: 169000, cents: 950, code: 'vip_1year' },
  starter_bundle: { rials: 49000,  cents: 250, code: 'starter_bundle' },
};

type Method = 'card' | 'crypto';

export default function PaymentMethod() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: string };

  const [method, setMethod] = useState<Method | null>(null);

  const pricing = PRODUCT_PRICES[productId];
  const cardMutation = useInitCardPayment();
  const cryptoMutation = useInitCryptoPayment();

  const isLoading = cardMutation.isPending || cryptoMutation.isPending;

  const handleSelectMethod = async (selected: Method) => {
    setMethod(selected);

    if (!pricing) {
      Alert.alert('خطا', 'محصول یافت نشد');
      return;
    }

    try {
      if (selected === 'card') {
        const result = await cardMutation.mutateAsync({
          amountRials: pricing.rials,
        });
        // نتیجه را به Sheet پاس می‌دهیم — state محلی
        setCardResult(result);
      } else {
        const result = await cryptoMutation.mutateAsync({
          amountRials: pricing.rials,
        });
        setCryptoResult(result);
      }
    } catch {
      Alert.alert('خطا', 'مشکلی پیش آمد. دوباره تلاش کنید.');
      setMethod(null);
    }
  };

  const [cardResult, setCardResult] = useState<any>(null);
  const [cryptoResult, setCryptoResult] = useState<any>(null);

  if (cardResult) {
    return (
      <CardPaymentSheet
        data={cardResult}
        onClose={() => navigation.goBack()}
      />
    );
  }

  if (cryptoResult) {
    return (
      <CryptoPaymentSheet
        data={cryptoResult}
        onClose={() => navigation.goBack()}
      />
    );
  }

  return (
    <MainLayout>
      <SectionWithLine text="روش پرداخت" />

      {pricing && (
        <GlobalText style={styles.amount}>
          مبلغ: {pricing.rials.toLocaleString('fa-IR')} تومان
        </GlobalText>
      )}

      {isLoading ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.methods}>
          <TouchableOpacity
            style={styles.method}
            onPress={() => handleSelectMethod('card')}
          >
            <GlobalText style={styles.methodIcon}>💳</GlobalText>
            <GlobalText style={styles.methodTitle}>کارت به کارت</GlobalText>
            <GlobalText style={styles.methodDesc}>
              واریز به شماره کارت و آپلود رسید
            </GlobalText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.method}
            onPress={() => handleSelectMethod('crypto')}
          >
            <GlobalText style={styles.methodIcon}>🪙</GlobalText>
            <GlobalText style={styles.methodTitle}>USDT (TRC20)</GlobalText>
            <GlobalText style={styles.methodDesc}>
              پرداخت با تتر — بدون نیاز به درگاه ایرانی
            </GlobalText>
          </TouchableOpacity>
        </View>
      )}
    </MainLayout>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    amount: {
      textAlign: 'center',
      fontSize: 18,
      color: theme.colors.text,
      marginTop: 24,
      marginBottom: 8,
    },
    methods: {
      padding: 16,
      gap: 16,
      marginTop: 16,
    },
    method: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      gap: 8,
    },
    methodIcon: { fontSize: 36 },
    methodTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    methodDesc: {
      fontSize: 13,
      color: theme.colors.text,
      textAlign: 'center',
      opacity: 0.7,
    },
  });