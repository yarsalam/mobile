import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Clipboard,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../SectionWithLine';
import GlobalText from '../GlobalText';
import CustomButton from '../CustomButtonProps';
import {useTheme} from '../../context/MainContext';
import {useSubmitProof} from '../../api/mutations/payment/useSubmitProof';
import {CardPaymentInitResult} from '../../api/mutations/payment/useInitCardPayment';

interface Props {
  data: CardPaymentInitResult;
  onClose: () => void;
}

export default function CardPaymentSheet({data, onClose}: Props) {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const [proofUrl, setProofUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submitProof = useSubmitProof();

  const copyCard = () => {
    Clipboard.setString(data.cardNumber);
    Alert.alert('کپی شد', 'شماره کارت کپی شد');
  };

  const handleSubmit = async () => {
    if (!proofUrl.trim()) {
      Alert.alert('خطا', 'لطفاً لینک رسید را وارد کنید');
      return;
    }

    await submitProof.mutateAsync({paymentId: data.paymentId, proofUrl});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <MainLayout>
        <View style={styles.center}>
          <GlobalText style={styles.doneIcon}>✅</GlobalText>
          <GlobalText style={styles.doneTitle}>رسید دریافت شد</GlobalText>
          <GlobalText style={styles.doneDesc}>
            پس از بررسی توسط تیم پشتیبانی، اشتراک شما فعال می‌شود. معمولاً کمتر
            از ۳۰ دقیقه طول می‌کشد.
          </GlobalText>
          <CustomButton label="بستن" onPress={onClose} gradient={false} />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionWithLine text="پرداخت کارت به کارت" />

      <View style={styles.container}>
        <GlobalText style={styles.label}>مبلغ:</GlobalText>
        <GlobalText style={styles.value}>
          {data.amount.toLocaleString('fa-IR')} تومان
        </GlobalText>

        <GlobalText style={styles.label}>به نام:</GlobalText>
        <GlobalText style={styles.value}>{data.accountHolder}</GlobalText>

        <GlobalText style={styles.label}>شماره کارت:</GlobalText>
        <TouchableOpacity onPress={copyCard} style={styles.cardBox}>
          <GlobalText style={styles.cardNumber}>
            {data.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
          </GlobalText>
          <GlobalText style={styles.copyHint}>ضربه بزن تا کپی شود</GlobalText>
        </TouchableOpacity>

        <GlobalText style={styles.warning}>
          ⚠️ لطفاً دقیقاً {data.amount.toLocaleString('fa-IR')} تومان واریز
          کنید. مبلغ متفاوت تأیید نمی‌شود.
        </GlobalText>

        <GlobalText style={[styles.label, {marginTop: 24}]}>
          بعد از واریز، لینک تصویر رسید را وارد کنید:
        </GlobalText>
        <TextInput
          style={styles.input}
          value={proofUrl}
          onChangeText={setProofUrl}
          placeholder="https://..."
          placeholderTextColor={theme.colors.border}
          autoCapitalize="none"
          keyboardType="url"
        />

        <CustomButton
          label={submitProof.isPending ? 'در حال ارسال...' : 'ثبت رسید'}
          onPress={handleSubmit}
          gradient
          disabled={submitProof.isPending}
        />
      </View>
    </MainLayout>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {padding: 20, gap: 8},
    label: {color: theme.colors.text, opacity: 0.6, fontSize: 13},
    value: {color: theme.colors.text, fontSize: 18, fontWeight: 'bold'},
    cardBox: {
      backgroundColor: theme.colors.primary + '15',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginVertical: 4,
    },
    cardNumber: {
      fontSize: 22,
      letterSpacing: 4,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    copyHint: {
      fontSize: 11,
      color: theme.colors.text,
      opacity: 0.5,
      marginTop: 4,
    },
    warning: {
      color: '#f59e0b',
      fontSize: 13,
      textAlign: 'center',
      marginTop: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 10,
      padding: 12,
      color: theme.colors.text,
      fontSize: 14,
      textAlign: 'left',
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      gap: 16,
    },
    doneIcon: {fontSize: 64},
    doneTitle: {fontSize: 22, fontWeight: 'bold', color: theme.colors.text},
    doneDesc: {
      fontSize: 15,
      color: theme.colors.text,
      textAlign: 'center',
      opacity: 0.7,
    },
  });
