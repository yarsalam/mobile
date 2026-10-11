import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import GlobalText from '../../components/GlobalText';
import AuthLayout from '../../components/user/AuthLayout';
import CustomButton from '../../components/CustomButtonProps';
import FormInput from '../../components/FormInput';

import {
  saveRegisterStep,
  saveRegisterChannel,
  getRegisterPhone,
} from '../../lib/useRegisterStorage';

import {
  selectChannelSchema,
  SelectChannelType,
} from '../../schemas/authSchemas';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../types/rootStackParamList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SelectChannel = () => {
  const navigation = useNavigation<Nav>();

  const {
    control,
    handleSubmit,
    formState: {errors, submitCount},
  } = useForm<SelectChannelType>({
    resolver: zodResolver(selectChannelSchema),
    defaultValues: {
      channel: undefined,
    },
  });

  const onSubmit = async (data: SelectChannelType) => {
    const phone = await getRegisterPhone();
    if (!phone) return;

    await saveRegisterChannel(data.channel);
    await saveRegisterStep(3);

    if (data.channel === 'telegram') {
      navigation.navigate('TelegramActivation');
    } else {
      navigation.navigate('WhatsAppActivation');
    }
  };

  return (
    <AuthLayout
      cardTitle="روش دریافت کد تأیید"
      errors={errors}
      submitCount={submitCount}>
      <GlobalText style={styles.label}>
        روش دریافت کد تایید را انتخاب کنید:
      </GlobalText>

      <Controller
        control={control}
        name="channel"
        render={({field: {onChange, value}}) => (
          <FormInput
            type="radiobutton"
            value={value}
            onChange={val => onChange(val)}
            radioItems={[
              {label: 'واتساپ', value: 'whatsapp'},
              {label: 'تلگرام', value: 'telegram'},
            ]}
          />
        )}
      />

      <CustomButton
        gradient
        label="ادامه"
        onPress={handleSubmit(onSubmit)}
        style={{marginTop: 30}}
      />
    </AuthLayout>
  );
};

export default SelectChannel;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 10,
    color: '#fff',
  },
});
