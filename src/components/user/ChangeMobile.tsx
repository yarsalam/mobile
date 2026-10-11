import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Linking} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigation} from '@react-navigation/native';

import {
  ChangeMobileData,
  changeMobileSchema,
} from '../../schemas/changeMobileSchema';
import CustomButton from '../CustomButtonProps';
import FormInput from '../FormInput';
import FormCard from '../FormCard';
import ToastHandler from '../ToastHandler';
import GlobalText from '../GlobalText';
import {convertPersianNumbersToEnglish} from '../../utils/convertNumToEn';
import {useToast} from '../../context/ToastContext';
import { useSendChangePhoneMutation } from '../../api/mutations/changePhone/useSendChangePhoneMutation';
import { useVerifyChangePhoneMutation } from '../../api/mutations/changePhone/useVerifyChangePhoneMutation';

type Channel = 'telegram' | 'whatsapp';

const WHATSAPP_BOT_NUMBER = '989303934386';

export const ChangeMobile = () => {
  const navigation = useNavigation();
  const {showToast} = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<Channel>('telegram');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const sendCode = useSendChangePhoneMutation();
  const verifyCode = useVerifyChangePhoneMutation();

  // ─── Step 1: شماره جدید ───────────────────────────────────────────────
  const {
    handleSubmit: handleStep1,
    control: control1,
    formState: {errors: errors1, submitCount: submitCount1},
  } = useForm<ChangeMobileData>({
    resolver: zodResolver(changeMobileSchema),
    defaultValues: {phone: '', confirmPhone: ''},
  });

  const onStep1Submit = (data: ChangeMobileData) => {
    const normalized = convertPersianNumbersToEnglish(data.phone);
    setPhone(normalized);
    setStep(2);
  };

  // ─── Step 2: انتخاب کانال ─────────────────────────────────────────────
  const onStep2Submit = async () => {
    try {
      if (channel === 'whatsapp') {
        // OTP رو فرانت تولید میکنه (همون فلوی WhatsAppActivation)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);

        // ذخیره OTP در سرور
        await sendCode.mutateAsync({phone, channel, otp});

        // باز کردن واتساپ با کد + شماره جدید در متن
        const msg = `کد تایید یارسلام: ${otp}`;
        const encoded = encodeURIComponent(msg);
        const link = `https://wa.me/${WHATSAPP_BOT_NUMBER}?text=${encoded}`;

        Linking.openURL(link).catch(() => {
          showToast('خطا در باز کردن واتساپ', 'error');
        });
      } else {
        // تلگرام: بک‌اند کد رو میفرسته
        await sendCode.mutateAsync({phone, channel});
      }

      setStep(3);
    } catch {
      // toast در mutation هندل شده
    }
  };

  // ─── Step 3: تأیید کد ────────────────────────────────────────────────
  const {
    handleSubmit: handleStep3,
    control: control3,
    formState: {errors: errors3, submitCount: submitCount3},
  } = useForm<{code: string}>({
    defaultValues: {code: ''},
  });

  const onStep3Submit = async (data: {code: string}) => {
    try {
      const normalizedCode = convertPersianNumbersToEnglish(data.code);
      await verifyCode.mutateAsync({phone, code: normalizedCode, channel});
      navigation.goBack();
    } catch {
      // toast در mutation هندل شده
    }
  };

  // واتساپ: دوباره باز کردن واتساپ در صورت نیاز
  const reopenWhatsApp = () => {
    const msg = `کد تایید یارسلام: ${generatedOtp}`;
    const encoded = encodeURIComponent(msg);
    Linking.openURL(`https://wa.me/${WHATSAPP_BOT_NUMBER}?text=${encoded}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ── Step 1 ── */}
      {step === 1 && (
        <>
          <ToastHandler errors={errors1} submitCount={submitCount1} />
          <FormCard title="شماره موبایل جدید" style={{zIndex: 10000}}>
            <Controller
              name="phone"
              control={control1}
              render={({field}) => (
                <FormInput
                  label="شماره موبایل جدید"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="شماره موبایل جدید را وارد کنید"
                  keyboardType="numeric"
                  zIndex={4200}
                />
              )}
            />
            <Controller
              name="confirmPhone"
              control={control1}
              render={({field}) => (
                <FormInput
                  label="تکرار شماره موبایل"
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="تکرار شماره موبایل"
                  keyboardType="numeric"
                  zIndex={4000}
                />
              )}
            />
          </FormCard>
          <View style={styles.buttonContainer}>
            <CustomButton
              label="ادامه"
              onPress={handleStep1(onStep1Submit)}
              gradient={true}
            />
          </View>
        </>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <>
          <FormCard title="روش دریافت کد تأیید">
            <GlobalText style={styles.label}>
              روش دریافت کد تایید را انتخاب کنید:
            </GlobalText>
            <FormInput
              type="radiobutton"
              value={channel}
              onChange={(val: Channel) => setChannel(val)}
              radioItems={[
                {label: 'واتساپ', value: 'whatsapp'},
                {label: 'تلگرام', value: 'telegram'},
              ]}
            />
          </FormCard>
          <View style={styles.buttonContainer}>
            <CustomButton
              label={
                sendCode.isPending
                  ? 'در حال ارسال...'
                  : channel === 'whatsapp'
                  ? 'ارسال پیام واتساپ'
                  : 'ارسال کد تلگرام'
              }
              onPress={onStep2Submit}
              gradient={true}
              loading={sendCode.isPending}
              disabled={sendCode.isPending}
            />
          </View>
        </>
      )}

      {/* ── Step 3 ── */}
      {step === 3 && (
        <>
          <ToastHandler errors={errors3} submitCount={submitCount3} />
          <FormCard title="تأیید کد">
            {channel === 'whatsapp' ? (
              // واتساپ: کاربر پیام رو فرستاده، فقط باید تأیید کنه
              <>
                <GlobalText style={styles.label}>
                  پیام واتساپ را ارسال کردید؟ روی «تأیید» بزنید.
                </GlobalText>
                <CustomButton
                  label="بازکردن واتساپ (اگر ارسال نشد)"
                  onPress={reopenWhatsApp}
                  gradient={false}
                  style={styles.secondaryButton}
                />
                <CustomButton
                  label={verifyCode.isPending ? 'در حال تأیید...' : 'تأیید'}
                  onPress={() => onStep3Submit({code: generatedOtp})}
                  gradient={true}
                  style={{marginTop: 12}}
                  loading={verifyCode.isPending}
                  disabled={verifyCode.isPending}
                />
              </>
            ) : (
              // تلگرام: کاربر کد رو وارد میکنه
              <>
                <GlobalText style={styles.label}>
                  کد ارسال شده از طریق تلگرام را وارد کنید:
                </GlobalText>
                <Controller
                  name="code"
                  control={control3}
                  render={({field}) => (
                    <FormInput
                      type="text"
                      placeholder="کد ۶ رقمی"
                      keyboardType="numeric"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <CustomButton
                  label={verifyCode.isPending ? 'در حال تأیید...' : 'تأیید'}
                  onPress={handleStep3(onStep3Submit)}
                  gradient={true}
                  style={{marginTop: 20}}
                  loading={verifyCode.isPending}
                  disabled={verifyCode.isPending}
                />
              </>
            )}
          </FormCard>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, marginVertical: 10},
  buttonContainer: {marginTop: 24},
  label: {fontSize: 15, textAlign: 'right', marginBottom: 12, color: '#fff'},
  secondaryButton: {marginTop: 8, opacity: 0.8},
});
