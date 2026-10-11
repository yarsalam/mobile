import {View, ScrollView, StyleSheet} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuth} from '../../context/AuthContext';
import {useMemo, useEffect} from 'react';
import {
  EditProfileData,
  editProfileSchema,
} from '../../schemas/editProfileSchema';
import CustomButton from '../CustomButtonProps';
import FormInput from '../FormInput';
import {
  birthDay,
  birthMonth,
  birthYear,
  educationOptions,
  employmentOptions,
  healthOptions,
  heights,
  locationOption,
  maritalStatuses,
  nationalityOptions,
  religionOptions,
  weights,
  hobbiesOptions,
  valuesOptions,
} from '../../utils/data';
import ToastHandler from '../ToastHandler';
import {useEditProfileMutation} from '../../api/mutations/useEditProfileMutation';
import FormCard from '../FormCard';
import InterestSelector from '../InterestSelector';

export const EditProfile = () => {
  const {user} = useAuth();
  const {mutate, isPending} = useEditProfileMutation();

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: {errors, submitCount},
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      nickname: user?.nickname || '',
      birth_day: user?.birth_day || '',
      birth_month: user?.birth_month || '',
      birth_year: user?.birth_year || '',
      marital: user?.marital || '',
      province: user?.province || '',
      city: user?.city || '',
      nationality: user?.nationality || '',
      employment: user?.employment || '',
      education: user?.education || '',
      weight: user?.weight || '',
      height: user?.height || '',
      religion: user?.religion || '',
      health: user?.health || '',
      values_partner: user?.values_partner || [],
      partner_about: user?.partner_about || '',
      hobbies_partner: user?.hobbies_partner || [],
      aboutme: user?.aboutme || '',
      values_self: user?.values_self || [],
      hobbies_self: user?.hobbies_self || [],
    },
  });

  const selectedProvince = watch('province');
  const cities = useMemo(() => {
    const matched = locationOption.find(p => p.province === selectedProvince);
    return matched?.cities ?? [];
  }, [selectedProvince]);

  // ✅ city رو بعد از لود province ست کن
  useEffect(() => {
    if (user?.city && selectedProvince && user.province === selectedProvince) {
      setValue('city', user.city);
    }
  }, [selectedProvince, user]);

  const onSubmit = (data: EditProfileData) => {
    mutate(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ToastHandler errors={errors} submitCount={submitCount} />

      <FormCard title="مشخصات عمومی" style={{zIndex: 10000}}>
        <Controller
          name="nickname"
          control={control}
          render={({field}) => (
            <FormInput
              label="نام کاربری"
              type="text"
              value={field.value}
              onChange={field.onChange}
              zIndex={4200}
            />
          )}
        />
        <Controller
          name="birth_year"
          control={control}
          render={({field}) => (
            <FormInput
              label="سال تولد"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={birthYear.map(s => ({label: s, value: s}))}
              zIndex={4000}
            />
          )}
        />
        <Controller
          name="birth_month"
          control={control}
          render={({field}) => (
            <FormInput
              label="ماه تولد"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={birthMonth.map(s => ({label: s, value: s}))}
              zIndex={3800}
            />
          )}
        />
        <Controller
          name="birth_day"
          control={control}
          render={({field}) => (
            <FormInput
              label="روز تولد"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={birthDay.map(s => ({label: s, value: s}))}
              zIndex={3600}
            />
          )}
        />
      </FormCard>

      <FormCard title="وضعیت تاهل" style={{zIndex: 9000}}>
        <Controller
          name="marital"
          control={control}
          render={({field}) => (
            <FormInput
              label="وضعیت تأهل"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={maritalStatuses.map(s => ({label: s, value: s}))}
              zIndex={3400}
            />
          )}
        />
      </FormCard>

      <FormCard title="محل زندگی" style={{zIndex: 8000}}>
        <Controller
          name="province"
          control={control}
          render={({field}) => (
            <FormInput
              label="استان"
              type="dropdown"
              value={field.value}
              onChange={value => {
                field.onChange(value);
                setValue('city', '');
              }}
              placeholder="انتخاب کنید"
              dropdownItems={locationOption.map(p => ({
                label: p.province,
                value: p.province,
              }))}
              zIndex={3000}
            />
          )}
        />
        <Controller
          name="city"
          control={control}
          render={({field}) => (
            <FormInput
              label="شهر"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder={
                selectedProvince ? 'انتخاب کنید' : 'ابتدا استان را انتخاب کنید'
              }
              dropdownItems={cities.map(c => ({label: c, value: c}))}
              disabled={!selectedProvince}
              zIndex={2800}
            />
          )}
        />
        <Controller
          name="nationality"
          control={control}
          render={({field}) => (
            <FormInput
              label="قومیت"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={nationalityOptions.map(s => ({
                label: s,
                value: s,
              }))}
              zIndex={2600}
            />
          )}
        />
      </FormCard>

      <FormCard title="شغل و تحصیلات" style={{zIndex: 7000}}>
        <Controller
          name="employment"
          control={control}
          render={({field}) => (
            <FormInput
              label="وضعیت اشتغال"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={employmentOptions.map(s => ({label: s, value: s}))}
              zIndex={2400}
            />
          )}
        />
        <Controller
          name="education"
          control={control}
          render={({field}) => (
            <FormInput
              label="مدرک تحصیلی"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={educationOptions.map(s => ({label: s, value: s}))}
              zIndex={2200}
            />
          )}
        />
      </FormCard>

      <FormCard title="مشخصات ظاهری" style={{zIndex: 6000}}>
        <Controller
          name="weight"
          control={control}
          render={({field}) => (
            <FormInput
              label="وزن"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={weights.map(s => ({label: s, value: s}))}
              zIndex={2000}
            />
          )}
        />
        <Controller
          name="height"
          control={control}
          render={({field}) => (
            <FormInput
              label="قد"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={heights.map(s => ({label: s, value: s}))}
              zIndex={1800}
            />
          )}
        />
      </FormCard>

      <FormCard title="وضعیت سلامت" style={{zIndex: 4000}}>
        <Controller
          name="health"
          control={control}
          render={({field}) => (
            <FormInput
              label="وضعیت سلامت"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={healthOptions.map(s => ({label: s, value: s}))}
              zIndex={800}
            />
          )}
        />
      </FormCard>

      <FormCard title="اعتقادات" style={{zIndex: 3000}}>
        <Controller
          name="religion"
          control={control}
          render={({field}) => (
            <FormInput
              label="دین و مذهب"
              type="dropdown"
              value={field.value}
              onChange={field.onChange}
              placeholder="انتخاب کنید"
              dropdownItems={religionOptions.map(s => ({label: s, value: s}))}
              zIndex={600}
            />
          )}
        />
      </FormCard>

      <FormCard title="سرگرمی‌ها و ارزش‌های من" style={{zIndex: 2500}}>
        <Controller
          name="hobbies_self"
          control={control}
          render={({field}) => (
            <InterestSelector
              options={hobbiesOptions}
              selected={field.value || []}
              maxSelection={5}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="values_self"
          control={control}
          render={({field}) => (
            <InterestSelector
              options={valuesOptions}
              selected={field.value || []}
              maxSelection={3}
              onChange={field.onChange}
            />
          )}
        />
      </FormCard>

      <FormCard title="سرگرمی‌ها و ارزش‌های همسر" style={{zIndex: 2000}}>
        <Controller
          name="hobbies_partner"
          control={control}
          render={({field}) => (
            <InterestSelector
              options={hobbiesOptions}
              selected={field.value || []}
              maxSelection={5}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="values_partner"
          control={control}
          render={({field}) => (
            <InterestSelector
              options={valuesOptions}
              selected={field.value || []}
              maxSelection={3}
              onChange={field.onChange}
            />
          )}
        />
      </FormCard>

      <FormCard title="درباره من و همسرم" style={{zIndex: 1500}}>
        <Controller
          name="aboutme"
          control={control}
          render={({field}) => (
            <FormInput
              label="درباره من"
              type="textarea"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="partner_about"
          control={control}
          render={({field}) => (
            <FormInput
              label="درباره همسرم"
              type="textarea"
              value={field.value}
              onChange={field.onChange}
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
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
