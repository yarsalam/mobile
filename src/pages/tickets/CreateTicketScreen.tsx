import React from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import FormCard from '../../components/FormCard';
import FormInput from '../../components/FormInput';
import CustomButton from '../../components/CustomButtonProps';
import ToastHandler from '../../components/ToastHandler';
import {useTheme} from '../../context/MainContext';
import {useCreateTicket} from '../../api/mutations/tickets/useCreateTicket';
import {
  createTicketSchema,
  CreateTicketFormData,
} from '../../schemas/ticketSchemas';

const CATEGORIES = [
  {label: 'فنی', value: 'technical'},
  {label: 'مالی', value: 'billing'},
  {label: 'حساب کاربری', value: 'account'},
  {label: 'پیشنهاد', value: 'feature_request'},
  {label: 'گزارش', value: 'report'},
  {label: 'سایر', value: 'other'},
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'CreateTicket'>;

const CreateTicketScreen = () => {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<Nav>();
  const {mutate, isPending} = useCreateTicket();

  const {
    control,
    handleSubmit,
    formState: {errors, submitCount}, // ← این باید باشه
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {category: 'other'},
  });

  const onSubmit: SubmitHandler<CreateTicketFormData> = data => {
    mutate(data, {onSuccess: () => navigation.goBack()});
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <MainLayout>
        <ToastHandler errors={errors} submitCount={submitCount} />

        <SectionWithLine text="ایجاد تیکت جدید" />
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <FormCard title="اطلاعات تیکت">
            <Controller
              control={control}
              name="title"
              render={({field: {onChange, value}}) => (
                <FormInput
                  label="عنوان"
                  type="text"
                  value={value}
                  onChange={onChange}
                  placeholder="موضوع تیکت را بنویسید"
                />
              )}
            />
            <Controller
              control={control}
              name="category"
              render={({field: {onChange, value}}) => (
                <FormInput
                  label="دسته‌بندی"
                  type="dropdown"
                  value={value}
                  onChange={onChange}
                  placeholder="دسته‌بندی را انتخاب کنید"
                  dropdownItems={CATEGORIES}
                  zIndex={1000}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({field: {onChange, value}}) => (
                <FormInput
                  label="توضیحات"
                  type="textarea"
                  value={value}
                  onChange={onChange}
                  placeholder="مشکل یا درخواست خود را شرح دهید"
                />
              )}
            />
          </FormCard>

          <CustomButton
            label={isPending ? 'در حال ارسال...' : 'ثبت تیکت'}
            onPress={handleSubmit(onSubmit)}
            gradient
            loading={isPending}
            style={styles.submitBtn}
          />
        </ScrollView>
      </MainLayout>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    scroll: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 40,
    },
    submitBtn: {
      marginTop: 8,
      marginBottom: 16,
    },
  });

export default CreateTicketScreen;
