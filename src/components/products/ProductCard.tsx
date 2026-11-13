import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, Modal} from 'react-native';
import GlobalText from '../GlobalText';
import CustomButton from '../CustomButtonProps';
import {useTheme} from '../../context/MainContext';
import {useAuth} from '../../context/AuthContext';
import {ProductOption} from '../../../types/productsType';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../../types/rootStackParamList';
import {useWallet} from '../../api/queries/useWallet';
import {useBuyWithWallet} from '../../api/mutations/payment/useBuyWithWallet';
import {
  fetchPricingQuote,
  PricingQuote,
  recordPricingExposure,
} from '../../api/queries/product';

interface Props {
  title: string;
  description: string;
  icon: string;
  options: ProductOption[];
}

export default function ProductCard({
  title,
  description,
  icon,
  options,
}: Props) {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user} = useAuth();
  const [selected, setSelected] = useState<ProductOption | null>(null);
  const [quote, setQuote] = useState<PricingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(false);
  const [exposureState, setExposureState] = useState<
    'not_required' | 'pending' | 'recorded' | 'failed'
  >('not_required');
  const [showConfirm, setShowConfirm] = useState(false);
  const selectionVersion = useRef(0);
  const recordedQuoteId = useRef<string | null>(null);

  const {data: wallet} = useWallet();
  const buyMutation = useBuyWithWallet();

  const walletBalance = Number(wallet?.balance ?? 0); // ریال
  const selectedPrice = quote?.payablePriceRials ?? selected?.price ?? 0;
  const canAfford = walletBalance >= selectedPrice;

  const selectOption = async (option: ProductOption) => {
    const version = ++selectionVersion.current;
    setSelected(option);
    setQuote(null);
    setQuoteError(false);
    setQuoteLoading(true);
    setExposureState('not_required');
    setShowConfirm(false);
    try {
      const result = await fetchPricingQuote(String(option.id));
      if (version !== selectionVersion.current) return;
      if (
        result.bundleCode !== String(option.id) ||
        !Number.isSafeInteger(result.payablePriceRials) ||
        result.payablePriceRials <= 0
      ) {
        throw new Error('Invalid pricing quote response');
      }
      setQuote(result);
    } catch {
      if (version === selectionVersion.current) {
        setQuoteError(true);
        Alert.alert('خطا', 'دریافت قیمت معتبر ممکن نشد. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      if (version === selectionVersion.current) setQuoteLoading(false);
    }
  };

  // Exposure is recorded only after the quote is present in the rendered UI.
  // The backend idempotency receipt makes repeated effects safe.
  useEffect(() => {
    if (!quote?.eligibleForExperiment || !quote.quoteId) {
      setExposureState('not_required');
      return;
    }
    if (recordedQuoteId.current === quote.quoteId) {
      setExposureState('recorded');
      return;
    }
    let active = true;
    setExposureState('pending');
    recordPricingExposure(quote.quoteId)
      .then(() => {
        if (!active) return;
        recordedQuoteId.current = quote.quoteId;
        setExposureState('recorded');
      })
      .catch(() => {
        if (!active) return;
        setExposureState('failed');
      });
    return () => {
      active = false;
    };
  }, [quote]);

  const handleBuy = () => {
    if (!selected || !quote || quoteError || quoteLoading) return;
    if (quote.eligibleForExperiment && exposureState !== 'recorded') {
      Alert.alert(
        'پیشنهاد در حال آماده‌سازی',
        'ثبت نمایش پیشنهاد هنوز تأیید نشده است. کمی بعد دوباره تلاش کنید.',
      );
      return;
    }

    if (canAfford) {
      setShowConfirm(true);
    } else {
      navigation.navigate('Deposit', {
        amountRials: selectedPrice - walletBalance,
        productLabel: `${title} — ${selected.label}`,
        bundleCode: selected.id,
      });
    }
  };

  const confirmPurchase = async () => {
    if (!selected || !quote) return;
    if (!user?.id || !Number.isSafeInteger(Number(user.id)) || Number(user.id) <= 0) {
      Alert.alert('خطا', 'برای خرید ابتدا وارد حساب کاربری شوید.');
      return;
    }

    setShowConfirm(false);
    try {
      await buyMutation.mutateAsync({
        bundleCode: String(selected.id),
        userId: Number(user.id),
        ...(quote.quoteId ? {pricingQuoteId: quote.quoteId} : {}),
      });
      Alert.alert('✅ موفق', `${title} با موفقیت فعال شد!`);
    } catch (err: any) {
      const code = err?.code || err?.message;
      const msg =
        code === 'INSUFFICIENT_BALANCE'
          ? 'موجودی کیف پول کافی نیست'
          : 'قیمت یا پیشنهاد تغییر کرده است. محصول را دوباره انتخاب کنید.';
      Alert.alert('خطا', msg);
    }
  };

  const exposureBlocked =
    quote?.eligibleForExperiment && exposureState !== 'recorded';

  return (
    <View style={styles.card}>
      <GlobalText style={styles.title}>
        {icon} {title}
      </GlobalText>
      <GlobalText style={styles.desc}>{description}</GlobalText>

      <View style={styles.options}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selected?.id === option.id && styles.optionActive,
            ]}
            onPress={() => selectOption(option)}
            disabled={quoteLoading}>
            <View style={styles.priceColumn}>
              {selected?.id === option.id && quote && quote.discountRials > 0 ? (
                <>
                  <GlobalText style={styles.originalPrice}>
                    {(quote.basePriceRials / 10).toLocaleString('fa-IR')} تومان
                  </GlobalText>
                  <GlobalText style={styles.discountPrice}>
                    {(quote.payablePriceRials / 10).toLocaleString('fa-IR')} تومان
                  </GlobalText>
                </>
              ) : (
                <GlobalText style={styles.optionPrice}>
                  {(option.price / 10).toLocaleString('fa-IR')} تومان
                </GlobalText>
              )}
            </View>
            <GlobalText style={styles.optionLabel}>{option.label}</GlobalText>
          </TouchableOpacity>
        ))}
      </View>

      {selected && (
        <View
          style={[
            styles.balanceRow,
            {backgroundColor: canAfford ? '#22c55e15' : '#ef444415'},
          ]}>
          <GlobalText style={styles.balanceText}>
            💰 موجودی: {(walletBalance / 10).toLocaleString('fa-IR')} تومان
          </GlobalText>
          <GlobalText
            style={[
              styles.balanceStatus,
              {color: canAfford ? '#22c55e' : '#ef4444'},
            ]}>
            {quoteLoading
              ? 'در حال دریافت قیمت...'
              : quoteError
                ? 'قیمت در دسترس نیست'
                : canAfford
                  ? '✓ کافیه'
                  : '✗ کمبود دارد'}
          </GlobalText>
        </View>
      )}

      {quote?.discountRials ? (
        <GlobalText style={styles.offerText}>
          پیشنهاد آزمایشی: {quote.discountBps / 100}٪ تخفیف
        </GlobalText>
      ) : null}
      {quote?.eligibleForExperiment && exposureState === 'pending' ? (
        <GlobalText style={styles.offerHint}>در حال ثبت نمایش پیشنهاد...</GlobalText>
      ) : null}
      {quote?.eligibleForExperiment && exposureState === 'failed' ? (
        <GlobalText style={styles.offerHint}>
          ثبت نمایش ناموفق بود؛ خرید با قیمت آزمایشی موقتاً غیرفعال است.
        </GlobalText>
      ) : null}

      <CustomButton
        label={
          buyMutation.isPending
            ? 'در حال پردازش...'
            : quoteLoading
              ? 'در حال دریافت قیمت...'
              : !selected
                ? 'انتخاب کنید'
                : !quote || quoteError
                  ? 'قیمت ناموجود'
                  : exposureBlocked
                    ? 'در حال ثبت پیشنهاد...'
                    : canAfford
                      ? '💰 خرید از کیف پول'
                      : '💳 شارژ و خرید'
        }
        onPress={handleBuy}
        gradient
        disabled={
          !selected ||
          !quote ||
          quoteError ||
          quoteLoading ||
          Boolean(exposureBlocked) ||
          buyMutation.isPending
        }
      />

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.overlay}>
          <View style={[styles.modal, {backgroundColor: theme.colors.background}]}>
            <GlobalText style={styles.modalIcon}>🛒</GlobalText>
            <GlobalText style={styles.modalTitle}>تأیید خرید</GlobalText>
            <GlobalText style={styles.modalProduct}>
              {title} — {selected?.label}
            </GlobalText>
            {quote && quote.discountRials > 0 ? (
              <GlobalText style={styles.originalPrice}>
                قیمت اصلی: {(quote.basePriceRials / 10).toLocaleString('fa-IR')} تومان
              </GlobalText>
            ) : null}
            <GlobalText style={styles.modalPrice}>
              {(selectedPrice / 10).toLocaleString('fa-IR')} تومان
            </GlobalText>
            <GlobalText style={styles.modalAfter}>
              موجودی پس از خرید:{' '}
              {((walletBalance - selectedPrice) / 10).toLocaleString('fa-IR')}{' '}
              تومان
            </GlobalText>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: theme.colors.border}]}
                onPress={() => setShowConfirm(false)}>
                <GlobalText style={{color: theme.colors.text, fontWeight: 'bold'}}>
                  انصراف
                </GlobalText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, {backgroundColor: theme.colors.primary}]}
                onPress={confirmPurchase}
                disabled={buyMutation.isPending}>
                <GlobalText style={{color: '#fff', fontWeight: 'bold'}}>
                  خرید
                </GlobalText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.background,
      borderWidth: 0.5,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    desc: {
      fontSize: 13,
      color: theme.colors.text,
      textAlign: 'center',
      marginVertical: 14,
      opacity: 0.75,
      lineHeight: 20,
    },
    options: {gap: 10, marginBottom: 14},
    option: {
      padding: 14,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.optionBackground,
    },
    optionActive: {
      borderColor: theme.colors.primary,
      borderWidth: 1.5,
      backgroundColor: theme.colors.primary + '15',
    },
    optionLabel: {color: theme.colors.text, fontWeight: 'bold', fontSize: 14},
    priceColumn: {alignItems: 'flex-start'},
    optionPrice: {color: theme.colors.text, fontSize: 13, opacity: 0.7},
    originalPrice: {
      color: theme.colors.text,
      fontSize: 12,
      opacity: 0.55,
      textDecorationLine: 'line-through',
    },
    discountPrice: {color: '#16a34a', fontSize: 14, fontWeight: 'bold'},
    offerText: {
      color: '#16a34a',
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    offerHint: {
      color: theme.colors.text,
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 8,
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      marginBottom: 12,
    },
    balanceText: {fontSize: 12, color: theme.colors.text},
    balanceStatus: {fontSize: 12, fontWeight: 'bold'},
    overlay: {
      flex: 1,
      backgroundColor: '#00000080',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modal: {
      width: '100%',
      borderRadius: 24,
      padding: 28,
      alignItems: 'center',
      gap: 8,
    },
    modalIcon: {fontSize: 44},
    modalTitle: {fontSize: 20, fontWeight: 'bold', color: theme.colors.text},
    modalProduct: {fontSize: 14, color: theme.colors.text, opacity: 0.7},
    modalPrice: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginTop: 4,
    },
    modalAfter: {
      fontSize: 12,
      color: theme.colors.text,
      opacity: 0.5,
      marginBottom: 8,
    },
    modalButtons: {flexDirection: 'row', gap: 12, marginTop: 8, width: '100%'},
    modalBtn: {flex: 1, padding: 14, borderRadius: 12, alignItems: 'center'},
  });
