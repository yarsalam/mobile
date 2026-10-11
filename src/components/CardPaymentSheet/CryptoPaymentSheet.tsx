import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Clipboard,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../SectionWithLine';
import GlobalText from '../GlobalText';
import CustomButton from '../CustomButtonProps';
import {useTheme} from '../../context/MainContext';
import {CryptoPaymentInitResult} from '../../api/mutations/payment/useInitCryptoPayment';

interface Props {
  data: CryptoPaymentInitResult;
  onClose: () => void;
}

export default function CryptoPaymentSheet({data, onClose}: Props) {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const [timeLeft, setTimeLeft] = useState('');

  // شمارش معکوس تا انقضا
  useEffect(() => {
    const tick = () => {
      const diff = new Date(data.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('منقضی شد');
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [data.expiresAt]);

  const copyAddress = () => {
    Clipboard.setString(data.walletAddress);
    Alert.alert('کپی شد', 'آدرس wallet کپی شد');
  };

  const amountUsdt = (data.amount / 100).toFixed(2);

  return (
    <MainLayout>
      <SectionWithLine text="پرداخت با USDT" />

      <View style={styles.container}>
        <View style={styles.timerBox}>
          <GlobalText style={styles.timerLabel}>زمان باقیمانده:</GlobalText>
          <GlobalText style={styles.timer}>{timeLeft}</GlobalText>
        </View>

        <GlobalText style={styles.label}>مبلغ:</GlobalText>
        <GlobalText style={styles.value}>{amountUsdt} USDT</GlobalText>

        <GlobalText style={styles.label}>شبکه:</GlobalText>
        <GlobalText style={styles.value}>{data.network}</GlobalText>

        <GlobalText style={styles.label}>آدرس wallet:</GlobalText>
        <TouchableOpacity onPress={copyAddress} style={styles.addressBox}>
          <GlobalText style={styles.address} numberOfLines={2}>
            {data.walletAddress}
          </GlobalText>
          <GlobalText style={styles.copyHint}>ضربه بزن تا کپی شود</GlobalText>
        </TouchableOpacity>

        <View style={styles.warningBox}>
          <GlobalText style={styles.warning}>
            ⚠️ دقیقاً {amountUsdt} USDT روی شبکه {data.network} ارسال کنید.
          </GlobalText>
          <GlobalText style={styles.warning}>
            پس از تأیید blockchain، اشتراک خودکار فعال می‌شود.
          </GlobalText>
          <GlobalText style={styles.warning}>
            ارسال به شبکه دیگر یا مبلغ متفاوت تأیید نمی‌شود.
          </GlobalText>
        </View>

        <CustomButton
          label="پرداخت کردم — بستن"
          onPress={onClose}
          gradient={false}
        />
      </View>
    </MainLayout>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {padding: 20, gap: 12},
    timerBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.primary + '15',
      borderRadius: 10,
      padding: 12,
    },
    timerLabel: {color: theme.colors.text, opacity: 0.7},
    timer: {color: theme.colors.primary, fontWeight: 'bold', fontSize: 18},
    label: {color: theme.colors.text, opacity: 0.6, fontSize: 13},
    value: {color: theme.colors.text, fontSize: 18, fontWeight: 'bold'},
    addressBox: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      gap: 8,
    },
    address: {
      fontSize: 13,
      color: theme.colors.primary,
      fontFamily: 'monospace',
      textAlign: 'center',
    },
    copyHint: {fontSize: 11, color: theme.colors.text, opacity: 0.5},
    warningBox: {
      backgroundColor: '#f59e0b20',
      borderRadius: 10,
      padding: 12,
      gap: 4,
    },
    warning: {color: '#f59e0b', fontSize: 12, textAlign: 'center'},
  });
