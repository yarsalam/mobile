import React, {useEffect, useState} from 'react';
import {StyleSheet, Linking} from 'react-native';
import CustomButton from '../../components/CustomButtonProps';
import GlobalText from '../../components/GlobalText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';
import {getRegisterPhone} from '../../lib/useRegisterStorage';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {telegramOtpFormSchema} from '../../schemas/authSchemas';

import FormInput from '../../components/FormInput';
import AuthLayout from '../../components/user/AuthLayout';
import {convertPersianNumbersToEnglish} from '../../utils/convertNumToEn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCompleteVerification} from '../../api/auth/mutations/useCompleteWhatsappVerification';
import {useVerifyTelegramCode} from '../../api/auth/mutations/useVerifyTelegramCode';
import {useToast} from '../../context/ToastContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TelegramActivation'>;

const TelegramActivation: React.FC<Props> = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  // const {verifyCode, resendTelegramCode} = useAuth(); // ← این متد مخصوص تلگرام است

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<{code: string}>({
    resolver: zodResolver(telegramOtpFormSchema),
    defaultValues: {code: ''},
  });

  useEffect(() => {
    const loadPhoneNumber = async () => {
      const phone = await getRegisterPhone();
      setPhoneNumber(phone);
    };
    loadPhoneNumber();
  }, []);

  const openTelegramBot = () => {
    // لینک بات شما
    const url = `tg://resolve?domain=yarsalam8523bot&start=${phoneNumber}`;

    Linking.openURL(url);
  };
  const completeVerification = useCompleteVerification();
  const verifyTelegramCode = useVerifyTelegramCode();
  const {showToast} = useToast();

  const onSubmit = async (data: {code: string}) => {
    if (!phoneNumber) return;

    try {
      await verifyTelegramCode.mutateAsync({
        phone: phoneNumber,
        code: convertPersianNumbersToEnglish(data.code),
        channel: 'telegram',
      });

      const res = await completeVerification.mutateAsync(phoneNumber);

      await AsyncStorage.setItem('temp_auth_token', res.token);

      navigation.navigate('multiStepProfile');
    } catch (err) {
      // خطا رو toast یا error در فرم نشون بده
      // showToast('کد اشتباه است یا خطایی رخ داد', 'error');
        console.log('VERIFY ERROR =', err);
  showToast(JSON.stringify(err), 'error');
    }

    // 4. رفتن به مرحله بعد
    navigation.navigate('multiStepProfile');
  };

  return (
    <AuthLayout cardTitle="فعالسازی تلگرام" errors={errors}>
      <GlobalText style={styles.subText}>
        روی دکمه "بازکردن ربات تلگرام" کلیک کنید، وارد تلگرام شوید و دکمه Start
        را بزنید. سپس کدی که ربات برای شما ارسال کرده را در کادر زیر وارد کنید و
        ادامه را بزنید.
      </GlobalText>

      <CustomButton
        label="بازکردن ربات تلگرام"
        onPress={openTelegramBot}
        style={{marginBottom: 15}}
        gradient={true}
      />

      <Controller
        control={control}
        name="code"
        render={({field: {onChange, value}}) => (
          <FormInput
            type="text"
            placeholder="کد ارسال شده در تلگرام را اینجا وارد کنید"
            keyboardType="numeric"
            value={value}
            onChange={onChange}
          />
        )}
      />

      <CustomButton
        label={
          verifyTelegramCode.isPending || completeVerification.isPending
            ? 'در حال تأیید...'
            : 'ادامه'
        }
        onPress={handleSubmit(onSubmit)}
        gradient={true}
        style={{marginVertical: 5}}
        loading={verifyTelegramCode.isPending || completeVerification.isPending}
        disabled={
          verifyTelegramCode.isPending || completeVerification.isPending
        }
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  subText: {textAlign: 'center', marginBottom: 12, color: '#fff'},
});

export default TelegramActivation;
