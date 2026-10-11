import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import { useTheme } from '../../context/MainContext';
import { fetchWithAuth } from '../../lib/fetchWithAuth';
import { useQueryClient } from '@tanstack/react-query';
import CardPaymentSheet from '../../components/CardPaymentSheet/CardPaymentSheet';
import CryptoPaymentSheet from '../../components/CardPaymentSheet/CryptoPaymentSheet';

const BASE = 'http://192.168.0.133:5001';

/**
 * DepositScreen — شارژ کیف پول
 *
 * params:
 *   amountRials:  number  — مبلغ پیشنهادی برای شارژ (ریال)
 *   productLabel: string  — نام محصول هدف (برای نمایش)
 *   bundleCode:   string  — بعد از شارژ موفق، به Products برمی‌گردد
 */
export default function DepositScreen() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  const qc = useQueryClient();

  const { amountRials, productLabel, bundleCode } = route.params as {
    amountRials: number;
    productLabel: string;
    bundleCode: string;
  };

  const [loading, setLoading] = useState(false);
  const [cardResult, setCardResult] = useState<any>(null);
  const [cryptoResult, setCryptoResult] = useState<any>(null);

  const handleCard = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${BASE}/payments/deposit/card`, {
        method: 'POST',
        body: JSON.stringify({ amountRials }),
      });
      setCardResult(res?.data ?? res);
    } catch {
      Alert.alert('خطا', 'مشکلی پیش آمد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleCrypto = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${BASE}/payments/deposit/crypto`, {
        method: 'POST',
        body: JSON.stringify({ amountRials }),
      });
      setCryptoResult(res?.data ?? res);
    } catch {
      Alert.alert('خطا', 'مشکلی پیش آمد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    qc.invalidateQueries({ queryKey: ['wallet'] });
    navigation.goBack();
  };

  if (cardResult) {
    return <CardPaymentSheet data={cardResult} onClose={handleClose} />;
  }

  if (cryptoResult) {
    return <CryptoPaymentSheet data={cryptoResult} onClose={handleClose} />;
  }

  return (
    <MainLayout>
      <SectionWithLine text="شارژ کیف پول" />

      <View style={styles.infoBox}>
        <GlobalText style={styles.infoIcon}>💰</GlobalText>
        <GlobalText style={styles.infoTitle}>موجودی کافی نیست</GlobalText>
        {productLabel ? (
          <GlobalText style={styles.infoDesc}>
            برای خرید «{productLabel}» کیف پول خود را شارژ کنید
          </GlobalText>
        ) : null}
        <View style={styles.divider} />
        <GlobalText style={styles.amountLabel}>مبلغ پیشنهادی</GlobalText>
        <GlobalText style={styles.amountValue}>
          {(amountRials / 10).toLocaleString('fa-IR')} تومان
        </GlobalText>
      </View>

      {loading ? (
        <ActivityIndicator
          color={theme.colors.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={styles.methods}>
          <TouchableOpacity style={styles.method} onPress={handleCard}>
            <View style={styles.methodHeader}>
              <GlobalText style={styles.methodIcon}>💳</GlobalText>
              <View style={styles.methodInfo}>
                <GlobalText style={styles.methodTitle}>کارت به کارت</GlobalText>
                <GlobalText style={styles.methodBadge}>
                  تأیید توسط ادمین
                </GlobalText>
              </View>
            </View>
            <GlobalText style={styles.methodDesc}>
              واریز به شماره کارت و آپلود تصویر رسید
            </GlobalText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.method} onPress={handleCrypto}>
            <View style={styles.methodHeader}>
              <GlobalText style={styles.methodIcon}>🪙</GlobalText>
              <View style={styles.methodInfo}>
                <GlobalText style={styles.methodTitle}>USDT (TRC20)</GlobalText>
                <GlobalText style={[styles.methodBadge, { color: '#22c55e' }]}>
                  تأیید خودکار
                </GlobalText>
              </View>
            </View>
            <GlobalText style={styles.methodDesc}>
              پرداخت با تتر — بدون نیاز به درگاه بانکی
            </GlobalText>
          </TouchableOpacity>
        </View>
      )}
    </MainLayout>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    infoBox: {
      margin: 16,
      padding: 24,
      backgroundColor: theme.colors.primary + '12',
      borderRadius: 20,
      alignItems: 'center',
      gap: 6,
    },
    infoIcon: { fontSize: 40 },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginTop: 4,
    },
    infoDesc: {
      fontSize: 13,
      color: theme.colors.text,
      opacity: 0.7,
      textAlign: 'center',
    },
    divider: {
      height: 1,
      width: '80%',
      backgroundColor: theme.colors.border,
      marginVertical: 12,
    },
    amountLabel: { fontSize: 13, color: theme.colors.text, opacity: 0.6 },
    amountValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    methods: { padding: 16, gap: 12 },
    method: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      gap: 10,
    },
    methodHeader: { flexDirection: 'row', alignItems: 'center' },
    methodIcon: { fontSize: 35, width: 45 },
    methodInfo: { flex: 1, alignItems: 'flex-end' },
    methodTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'right',
      width: '100%',
    },
    methodBadge: {
      fontSize: 14,
      color: theme.colors.secondary,
      marginTop: 2,
      textAlign: 'right',
      width: '100%',
    },
    methodDesc: {
      fontSize: 15,
      color: theme.colors.text,
      opacity: 0.6,
      textAlign: 'right',
    },
  });
