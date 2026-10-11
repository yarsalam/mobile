import React from 'react';
import {StyleSheet} from 'react-native';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  registerStep1Schema,
  RegisterStep1Type,
} from '../../schemas/authSchemas';
import CustomButton from '../../components/CustomButtonProps';
import GlobalText from '../../components/GlobalText';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';
import {Controller} from 'react-hook-form';
import {convertPersianNumbersToEnglish} from '../../utils/convertNumToEn';

import {
  saveRegisterPhone,
  saveRegisterStep,
} from '../../lib/useRegisterStorage';
import {useNavigation} from '@react-navigation/native';
import FormInput from '../../components/FormInput';
import {useRegisterStep1Mutation} from '../../api/auth/mutations/useRegisterStep1Mutation';
import AuthLayout from '../../components/user/AuthLayout';
import {getAcquisitionData} from '../../utils/acquisition';
import {useToast} from '../../context/ToastContext';
import {getRegisterStatus} from '../../api/auth/queries/auth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<RegisterProps> = () => {
  const navigation = useNavigation<NavigationProp>();
  const {showToast} = useToast(); // بالای کامپوننت، کنار useForm
  React.useEffect(() => {}, [navigation]);

  const {
    control,
    handleSubmit,
    formState: {errors, submitCount},
  } = useForm<RegisterStep1Type>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      phone: '',
      gender: '',
    },
  });
  const register = useRegisterStep1Mutation();

  const onSubmit = async (data: RegisterStep1Type) => {
    const phone = convertPersianNumbersToEnglish(data.phone);

    // اگه این شماره قبلاً ثبت‌نام کامل کرده، به‌جای تلاش دوباره، بفرستش Login
    const status = await getRegisterStatus(phone);
    if (status.isVerified && status.isCompleted) {
      showToast('این شماره قبلاً ثبت‌نام شده است', 'error');
      navigation.navigate('Login', {
        error: '',
      });
      return;
    }

    let acq;
    try {
      acq = await getAcquisitionData();
    } catch {
      acq = {
        acquisitionSource: 'mobile',
        acquisitionKeyword: null,
        referralCode: null,
        acquisitionMeta: {},
      };
    }

    const {
      acquisitionSource,
      acquisitionKeyword,
      referralCode,
      acquisitionMeta,
    } = acq;

    const sanitizedData = {
      ...data,
      platform: 'mobile' as const,
      phone,
      acquisitionSource,
      acquisitionKeyword,
      metadata: {referralCode, ...acquisitionMeta},
    };

    try {
      const res = await register.mutateAsync(sanitizedData);
      console.log('STEP1 SUCCESS', res);
      await saveRegisterPhone(sanitizedData.phone);
      await saveRegisterStep(2);
      navigation.navigate('SelectChannel');
    } catch (e) {
      showToast('ثبت‌نام انجام نشد، دوباره تلاش کنید', 'error');
      console.log('STEP1 ERROR', e);
    }
  };

  return (
    <AuthLayout
      cardTitle="ثبت نام در یارسلام"
      errors={errors} // ← مهم: حتما پاس کن
      submitCount={submitCount} // ← مهم: حتما پاس کن
      onContinue={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="phone"
        render={({field: {onChange, value}}) => (
          <FormInput
            type="text"
            placeholder="شماره موبایل"
            keyboardType="phone-pad"
            value={value || ''}
            onChange={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({field: {onChange, value}}) => (
          <FormInput
            type="dropdown"
            placeholder="جنسیت"
            value={value}
            onChange={onChange}
            dropdownItems={[
              {label: 'مرد', value: 'men'},
              {label: 'زن', value: 'women'},
            ]}
          />
        )}
      />

      <GlobalText style={styles.Logintext}>
        اگر قبلا ثبت نام کرده اید{' '}
        <GlobalText
          style={styles.Redtext}
          onPress={() => navigation.navigate({name: 'Login', params: {}})}>
          وارد شوید
        </GlobalText>
      </GlobalText>

      <CustomButton
        gradient={true}
        label="ادامه"
        style={{marginTop: 20}}
        loading={register.isPending}
        onPress={handleSubmit(onSubmit)}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  Redtext: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 17,
  },
  Logintext: {
    fontSize: 17,
    paddingVertical: 10,
    color: '#fff',
    textAlign: 'right',
  },
});

export default Register;
