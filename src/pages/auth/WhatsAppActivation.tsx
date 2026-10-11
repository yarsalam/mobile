import React, {useEffect, useState} from 'react';
import {StyleSheet, Linking} from 'react-native';
import CustomButton from '../../components/CustomButtonProps';
import GlobalText from '../../components/GlobalText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';
import {getRegisterPhone} from '../../lib/useRegisterStorage';
import AuthLayout from '../../components/user/AuthLayout';
import {useToast} from '../../context/ToastContext';
import {useSaveWhatsAppMutation} from '../../api/auth/mutations/useSaveWhatsAppMutation';
import {useVerifyWhatsAppMutation} from '../../api/auth/mutations/useVerifyWhatsAppMutation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCompleteVerification} from '../../api/auth/mutations/useCompleteWhatsappVerification';

type Props = NativeStackScreenProps<RootStackParamList, 'WhatsAppActivation'>;

const WhatsAppActivation: React.FC<Props> = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const {showToast} = useToast();
  const saveWhatsApp = useSaveWhatsAppMutation();
  const verifyWhatsApp = useVerifyWhatsAppMutation();
  const completeVerification = useCompleteVerification();

  useEffect(() => {
    const loadPhoneNumber = async () => {
      const phone = await getRegisterPhone();
      setPhoneNumber(phone);
    };
    loadPhoneNumber();
  }, []);

  // 1) ارسال پیام واتساپ با OTP
  const sendWhatsAppMessage = async () => {
    if (!phoneNumber) return;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // ذخیره OTP در سرور + دریافت sessionId
      const res = await saveWhatsApp.mutateAsync({phone: phoneNumber, otp});
      console.log('saveWhatsApp response:', res); // ← این لاگ را اضافه کن

      const receiver = '989303934386';

      const msg = `کد تایید شما: ${otp}`;

      console.log('WhatsApp message:', msg); // ← لاگ متن کامل

      const encoded = encodeURIComponent(msg);
      const link = `https://wa.me/${receiver}?text=${encoded}`;

      Linking.openURL(link).catch(err => {
        console.error('WhatsApp link error:', err);
        showToast('خطا در باز کردن واتساپ', 'error');
      });
    } catch (err) {
      console.error('saveWhatsAppOtp error:', err);
      showToast('خطا در ذخیره OTP', 'error');
    }
  };

  // 2) چک کردن وضعیت Verify از سرور
  const onContinue = async () => {
    // مرحله ۱: چک کن واتساپ تأیید شده؟
    const verifyRes = await verifyWhatsApp.mutateAsync(phoneNumber);

    if (!verifyRes.verified) {
      showToast('هنوز پیام واتساپ دریافت نشده', 'error');
      return;
    }

    // مرحله ۲: حالا توکن موقت رو بگیر!
    try {
      const completeRes = await completeVerification.mutateAsync(phoneNumber);
      console.log('completeRes:', JSON.stringify(completeRes));
      await AsyncStorage.setItem('temp_auth_token', completeRes.token);

      showToast('تأیید شد! حالا پروفایلت رو کامل کن', 'success');
      navigation.navigate('multiStepProfile');
    } catch (err: any) {
      showToast(err.message || 'خطا در دریافت توکن موقت', 'error');
    }
  };

  return (
    <AuthLayout cardTitle="فعالسازی واتساپ">
      <GlobalText style={styles.subText}>
        روی «ارسال پیام واتساپ» بزنید و پیام را ارسال کنید، سپس ادامه را بزنید.
      </GlobalText>

      <CustomButton
        label="ارسال پیام واتساپ"
        onPress={sendWhatsAppMessage}
        gradient={true}
        loading={saveWhatsApp.isPending}
      />

      <CustomButton
        label="ادامه"
        onPress={onContinue}
        gradient={true}
        style={{marginTop: 20}}
        loading={verifyWhatsApp.isPending}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  subText: {textAlign: 'center', marginBottom: 10, color: '#fff'},
});

export default WhatsAppActivation;
