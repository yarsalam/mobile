import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import CustomButton from '../CustomButtonProps';
import FormInput from '../FormInput';
import FormCard from '../FormCard';
import ToastHandler from '../ToastHandler';
import {
  ChangePasswordData,
  changePasswordSchema,
} from '../../schemas/changePasswordSchema';
import {useChangePassword} from '../../api/mutations/changePassword';

export const ChangePassword = () => {
  const {mutate, isPending} = useChangePassword();

  const {
    handleSubmit,
    control,
    formState: {errors, submitCount},
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {password: '', confirmPassword: ''},
  });

  const onSubmit = (data: ChangePasswordData) => {
    mutate(data.password);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ToastHandler errors={errors} submitCount={submitCount} />
      <FormCard title="ویرایش رمز عبور" style={{zIndex: 10000}}>
        <Controller
          name="password"
          control={control}
          render={({field}) => (
            <FormInput
              label="رمز عبور جدید"
              type="text"
              secureTextEntry
              value={field.value}
              onChange={field.onChange}
              zIndex={4200}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({field}) => (
            <FormInput
              label="تکرار رمز عبور"
              type="text"
              secureTextEntry
              value={field.value}
              onChange={field.onChange}
              zIndex={4000}
            />
          )}
        />
      </FormCard>
      <View style={styles.buttonContainer}>
        <CustomButton
          label={isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          onPress={handleSubmit(onSubmit)}
          gradient={true}
          loading={isPending}
          disabled={isPending}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 16, marginVertical: 10},
  buttonContainer: {marginTop: 24},
});
