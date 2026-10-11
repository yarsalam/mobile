import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, Modal} from 'react-native';
import GlobalText from '../GlobalText';
import CustomButton from '../CustomButtonProps';
import {useTheme} from '../../context/MainContext';
import {ProductOption} from '../../../types/productsType';
import {useNavigation} from '@react-navigation/native';
import {useWallet} from '../../api/queries/useWallet';
import {useBuyWithWallet} from '../../api/mutations/payment/useBuyWithWallet';

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
  const navigation = useNavigation();
  const [selected, setSelected] = useState<ProductOption | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const {data: wallet} = useWallet();
  const buyMutation = useBuyWithWallet();

  const walletBalance = Number(wallet?.balance ?? 0); // ریال
  const selectedPrice = selected?.price ?? 0; // ریال
  const canAfford = walletBalance >= selectedPrice;

  const handleBuy = () => {
    if (!selected) return;

    if (canAfford) {
      setShowConfirm(true);
    } else {
      // کمبود موجودی — رفتن به شارژ
      navigation.navigate(
        'Deposit' as never,
        {
          amountRials: selectedPrice - walletBalance, // کمبود دقیق
          productLabel: `${title} — ${selected.label}`,
          bundleCode: selected.id,
        } as never,
      );
    }
  };

  const confirmPurchase = async () => {
    if (!selected) return;
    setShowConfirm(false);
    try {
      await buyMutation.mutateAsync(selected.id);
      Alert.alert('✅ موفق', `${title} با موفقیت فعال شد!`);
    } catch (err: any) {
      const code = err?.code || err?.message;
      const msg =
        code === 'INSUFFICIENT_BALANCE'
          ? 'موجودی کیف پول کافی نیست'
          : 'مشکلی پیش آمد. دوباره تلاش کنید.';
      Alert.alert('خطا', msg);
    }
  };

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
            onPress={() => setSelected(option)}>
            <GlobalText style={styles.optionPrice}>
              {(option.price / 10).toLocaleString('fa-IR')} تومان
            </GlobalText>
            <GlobalText style={styles.optionLabel}>{option.label}</GlobalText>
          </TouchableOpacity>
        ))}
      </View>

      {/* نمایش وضعیت موجودی */}
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
            {canAfford ? '✓ کافیه' : '✗ کمبود دارد'}
          </GlobalText>
        </View>
      )}

      <CustomButton
        label={
          buyMutation.isPending
            ? 'در حال پردازش...'
            : !selected
            ? 'انتخاب کنید'
            : canAfford
            ? '💰 خرید از کیف پول'
            : '💳 شارژ و خرید'
        }
        onPress={handleBuy}
        gradient
        disabled={!selected || buyMutation.isPending}
      />

      {/* Modal تأیید خرید */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}>
        <View style={styles.overlay}>
          <View
            style={[styles.modal, {backgroundColor: theme.colors.background}]}>
            <GlobalText style={styles.modalIcon}>🛒</GlobalText>
            <GlobalText style={styles.modalTitle}>تأیید خرید</GlobalText>
            <GlobalText style={styles.modalProduct}>
              {title} — {selected?.label}
            </GlobalText>
            <GlobalText style={styles.modalPrice}>
              {((selected?.price ?? 0) / 10).toLocaleString('fa-IR')} تومان
            </GlobalText>
            <GlobalText style={styles.modalAfter}>
              موجودی پس از خرید:{' '}
              {((walletBalance - selectedPrice) / 10).toLocaleString('fa-IR')}{' '}
              تومان
            </GlobalText>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {backgroundColor: theme.colors.border},
                ]}
                onPress={() => setShowConfirm(false)}>
                <GlobalText
                  style={{color: theme.colors.text, fontWeight: 'bold'}}>
                  انصراف
                </GlobalText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {backgroundColor: theme.colors.primary},
                ]}
                onPress={confirmPurchase}>
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
    optionPrice: {color: theme.colors.text, fontSize: 13, opacity: 0.7},
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
