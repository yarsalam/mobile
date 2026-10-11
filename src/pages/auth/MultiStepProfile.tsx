import React, {useEffect, useMemo, useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Controller, useWatch} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

// کامپوننت‌ها
import FormInput from '../../components/FormInput';
import FloatingActionButton from '../../components/FloatingActionButton';
import GlobalText from '../../components/GlobalText';
import InterestSelector from '../../components/InterestSelector';

// داده‌ها
import {
  birthDay,
  birthMonth,
  birthYear,
  employmentOptions,
  educationOptions,
  weights,
  heights,
  religionOptions,
  valuesOptions,
  nationalityOptions,
  locationOption,
  maritalStatuses,
  hobbiesOptions,
  healthOptions,
} from '../../utils/data';

// ابزارها
import {usePersistedForm} from '../../lib/usePersistedForm';
import {getRegisterPhone} from '../../lib/useRegisterStorage';
import {useToast} from '../../context/ToastContext';
import {
  MultiStepProfileForm,
  MultiStepProfilePayload,
  multiStepProfileSchema,
} from '../../schemas/authSchemas';
import {MultiStepProfileDefaultValues} from '../../utils/MultiStepProfileDefaultValues';
import {useMultiStepProfileMutation} from '../../api/auth/mutations/useMultiStepProfileMutation';
import AuthLayout from '../../components/user/AuthLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MultiStepProfile: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const {showToast} = useToast();
  const endStepProfile = useMultiStepProfileMutation();
  const form = usePersistedForm<MultiStepProfileForm>(
    'multiStepProfile',
    MultiStepProfileDefaultValues,
    {
      resolver: zodResolver(multiStepProfileSchema),
      mode: 'onChange',
      persist: true,
    },
  );

  const {
    control,
    formState: {errors, submitCount},
    setValue,
    getValues,
    trigger,
    reset,
  } = form;

  useEffect(() => {
    const loadInitialValues = async () => {
      const storedPhone = await getRegisterPhone();
      if (storedPhone) {
        setValue('phone', storedPhone);
      }
    };
    loadInitialValues();
  }, [setValue]);

  const selectedProvince = useWatch({control, name: 'province'});

  const cities = useMemo(() => {
    const matchedProvince = locationOption.find(
      p => p.province === selectedProvince,
    );
    return matchedProvince?.cities ?? [];
  }, [selectedProvince]);

  const progress = useMemo(() => step * 25, [step]);

  const goNext = async () => {
    const fieldsByStep: Record<number, string[]> = {
      1: [
        'nickname',
        'birthDate.day',
        'birthDate.month',
        'birthDate.year',
        'marital',
        'province',
        'city',
        'nationality',
      ],
      2: ['employment', 'education', 'weight', 'height', 'health', 'religion'],
      3: ['partner_about', 'values_partner', 'hobbies_partner'],
      4: [
        'aboutme',
        'values_self',
        'hobbies_self',
        'password',
        'confirmPassword',
      ],
    };

    const valid = await trigger(fieldsByStep[step] as any, {shouldFocus: true});

    if (!valid) {
      // گرفتن اولین پیام خطا
      const firstField = fieldsByStep[step].find(f => {
        const parts = f.split('.');
        let err: any = errors;
        for (const p of parts) {
          if (!err) break;
          err = err[p];
        }
        return !!err;
      });

      if (firstField) {
        const parts = firstField.split('.');
        let err: any = errors;
        for (const p of parts) {
          err = err?.[p];
        }
        if (err?.message) {
          showToast(err.message, 'error'); // نمایش خطای دقیق همون فیلد
        }
      }

      return; // جلو نمی‌ره
    }

    if (step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    } else {
      onSubmit(getValues());
    }
  };

  const goBack = () => setStep(s => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));

  const stepTitles: Record<1 | 2 | 3 | 4, string> = {
    1: 'اطلاعات پایه',
    2: 'ویژگی‌های فردی',
    3: 'ويژگیهای شخصیتی و سبک زندگی همراه من',
    4: 'ویژگیهای شخصیتی و سبک زندگی من',
  };

  const onSubmit = async (data: MultiStepProfileForm) => {
    const {confirmPassword,phone, ...payload} = data;
    const sendData: MultiStepProfilePayload = {...payload};
    endStepProfile.mutateAsync(sendData);
    form.stopPersisting();
    reset(MultiStepProfileDefaultValues);
  };
  /**************** استپ‌ها ****************/
  const Step1 = (
    <>
      <GlobalText style={styles.stepDescription}>
        اطلاعات پایه خود را وارد کنید تا بتوانیم پروفایل شما را ایجاد کنیم
      </GlobalText>
      <Controller
        name="phone"
        control={control}
        render={({field}) => (
          <FormInput
            label=""
            type="text"
            value={field.value}
            onChange={field.onChange}
            style={{display: 'none'}}
          />
        )}
      />
      <Controller
        name="nickname"
        control={control}
        render={({field}) => (
          <FormInput
            label="نام کاربری"
            type="text"
            value={field.value}
            onChange={field.onChange}
            placeholder="نام کاربری باید فارسی،حداقل۳ و حداکثر۷ حرفی باشد"
          />
        )}
      />

      <GlobalText style={{textAlign: 'right', paddingBottom: 7}}>
        تاریخ تولد:
      </GlobalText>
      <View
        style={{flexDirection: 'row', justifyContent: 'space-between', gap: 8}}>
        <View style={{flex: 1}}>
          <Controller
            name="birthDate.day"
            control={control}
            render={({field}) => (
              <FormInput
                label="روز"
                type="dropdown"
                value={field.value}
                onChange={field.onChange}
                dropdownItems={birthDay.map(s => ({label: s, value: s}))}
              />
            )}
          />
        </View>
        <View style={{flex: 1.2}}>
          <Controller
            name="birthDate.month"
            control={control}
            render={({field}) => (
              <FormInput
                label="ماه"
                type="dropdown"
                value={field.value}
                onChange={field.onChange}
                dropdownItems={birthMonth.map(s => ({label: s, value: s}))}
              />
            )}
          />
        </View>
        <View style={{flex: 1}}>
          <Controller
            name="birthDate.year"
            control={control}
            render={({field}) => (
              <FormInput
                label="سال"
                type="dropdown"
                value={field.value}
                onChange={field.onChange}
                dropdownItems={birthYear.map(s => ({label: s, value: s}))}
              />
            )}
          />
        </View>
      </View>

      <Controller
        name="marital"
        control={control}
        render={({field}) => (
          <FormInput
            label="وضعیت تأهل"
            type="dropdown"
            value={field.value}
            onChange={field.onChange}
            dropdownItems={maritalStatuses.map(s => ({label: s, value: s}))}
          />
        )}
      />

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
            dropdownItems={locationOption.map(p => ({
              label: p.province,
              value: p.province,
            }))}
          />
        )}
      />

      <Controller
        key={selectedProvince}
        name="city"
        control={control}
        render={({field}) => (
          <FormInput
            label="شهر"
            type="dropdown"
            value={field.value}
            onChange={field.onChange}
            dropdownItems={cities.map(c => ({label: c, value: c}))}
            disabled={!selectedProvince}
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
            dropdownItems={nationalityOptions.map(s => ({label: s, value: s}))}
          />
        )}
      />
    </>
  );

  const Step2 = (
    <>
      <GlobalText style={styles.stepDescription}>
        این بخش به ما کمک می‌کند تا افرادی با ویژگی‌های مشترک به شما پیشنهاد
        دهیم
      </GlobalText>

      <Controller
        name="employment"
        control={control}
        render={({field}) => (
          <FormInput
            label="وضعیت اشتغال"
            type="dropdown"
            value={field.value}
            onChange={field.onChange}
            dropdownItems={employmentOptions.map(s => ({label: s, value: s}))}
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
            dropdownItems={educationOptions.map(s => ({label: s, value: s}))}
          />
        )}
      />

      <Controller
        name="weight"
        control={control}
        render={({field}) => (
          <FormInput
            label="وزن"
            type="dropdown"
            value={field.value}
            onChange={field.onChange}
            dropdownItems={weights.map(s => ({label: s, value: s}))}
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
            dropdownItems={heights.map(s => ({label: s, value: s}))}
          />
        )}
      />

      <Controller
        name="health"
        control={control}
        render={({field}) => (
          <FormInput
            label="وضعیت سلامت"
            type="dropdown"
            value={field.value}
            onChange={field.onChange}
            dropdownItems={healthOptions.map(s => ({label: s, value: s}))}
          />
        )}
      />
      <Controller
        name="religion"
        control={control}
        render={({field}) => (
          <FormInput
            label="دین و مذهب"
            type="dropdown"
            value={field.value}
            onChange={field.onChange}
            dropdownItems={religionOptions.map(s => ({label: s, value: s}))}
          />
        )}
      />
    </>
  );

  const Step3 = (
    <>
      <GlobalText style={styles.stepDescription}>
        ویژگیهای شخصیتی همراه من
      </GlobalText>

      <Controller
        name="values_partner"
        control={control}
        render={({field}) => (
          <>
            <View style={styles.tagsContainer}>
              {valuesOptions.map(v => {
                // به جای value، label رو بررسی کن
                const selected = (field.value || []).includes(v.label);

                return (
                  <TouchableOpacity
                    key={v.value}
                    style={[styles.tag, selected && styles.tagSelected]}
                    onPress={() => {
                      const current: string[] = field.value || [];
                      const exists = current.includes(v.label); // فارسی
                      const next = exists
                        ? current.filter(x => x !== v.label)
                        : [...current, v.label]; // فارسی

                      if (!exists && next.length > 3) {
                        showToast(
                          'حداکثر ۳ مورد می‌توانید انتخاب کنید',
                          'error',
                        );
                        return;
                      }
                      field.onChange(next as any);
                    }}
                    disabled={!selected && (field.value?.length || 0) >= 3}>
                    <GlobalText
                      style={[
                        styles.tagText,
                        selected && styles.tagTextSelected,
                      ]}>
                      {v.label} {/* همچنان فارسی نمایش داده میشه */}
                    </GlobalText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* انتخاب‌شده‌ها */}
            {field.value?.length > 0 && (
              <View style={styles.selectedRow}>
                {field.value.map((val: string) => (
                  <View key={val} style={styles.selectedChip}>
                    <GlobalText style={styles.selectedChipText}>
                      {val} {/* چون از قبل فارسی ذخیره شده */}
                    </GlobalText>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => {
                        field.onChange(
                          field.value.filter((x: string) => x !== val),
                        );
                      }}>
                      <GlobalText style={styles.removeBtnText}>✕</GlobalText>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      />

      <GlobalText style={styles.aboutWText}>درباره همسرم:</GlobalText>
      <Controller
        name="partner_about"
        control={control}
        render={({field}) => (
          <FormInput
            type="textarea"
            value={field.value}
            onChange={field.onChange}
            placeholder="شریک رویایی‌ات رو در چند جمله توصیف کن"
          />
        )}
      />
      <GlobalText style={styles.aboutWText}>سبک زندگی همراه من</GlobalText>
      <Controller
        name="hobbies_partner"
        control={control}
        render={({field}) => (
          <InterestSelector
            options={hobbiesOptions}
            selected={field.value || []}
            maxSelection={5}
            onChange={(values: string[]) => field.onChange(values)}
          />
        )}
      />
    </>
  );

  const Step4 = (
    <>
      {/* ویژگی‌های شخصیتی */}
      <GlobalText style={styles.stepDescription}>
        ویژگی‌های شخصیتی من
      </GlobalText>

      <Controller
        name="values_self"
        control={control}
        render={({field}) => (
          <>
            <View style={styles.tagsContainer}>
              {valuesOptions.map(v => {
                const selected = (field.value || []).includes(v.value);
                return (
                  <TouchableOpacity
                    key={v.value}
                    style={[styles.tag, selected && styles.tagSelected]}
                    onPress={() => {
                      const current: string[] = field.value || [];
                      const exists = current.includes(v.value);
                      const next = exists
                        ? current.filter(x => x !== v.value)
                        : [...current, v.value];

                      if (!exists && next.length > 3) {
                        showToast(
                          'حداکثر ۳ مورد می‌توانید انتخاب کنید',
                          'error',
                        );
                        return;
                      }

                      field.onChange(next as any);
                    }}
                    disabled={!selected && (field.value?.length || 0) >= 3}>
                    <GlobalText
                      style={[
                        styles.tagText,
                        selected && styles.tagTextSelected,
                      ]}>
                      {v.label}
                    </GlobalText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* انتخاب‌شده‌ها */}
            {field.value?.length > 0 && (
              <View style={styles.selectedRow}>
                {field.value.map((val: string) => {
                  const item = valuesOptions.find(v => v.value === val);
                  return (
                    <View key={val} style={styles.selectedChip}>
                      <GlobalText style={styles.selectedChipText}>
                        {item?.label}
                      </GlobalText>
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => {
                          field.onChange(
                            field.value.filter((x: string) => x !== val),
                          );
                        }}>
                        <GlobalText style={styles.removeBtnText}>✕</GlobalText>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}
      />

      {/* درباره من */}
      <GlobalText style={styles.aboutWText}>درباره من:</GlobalText>
      <Controller
        name="aboutme"
        control={control}
        render={({field}) => (
          <FormInput
            type="textarea"
            value={field.value}
            onChange={field.onChange}
            placeholder="خودت رو در چند جمله توصیف کن"
          />
        )}
      />

      {/* سبک زندگی */}
      <GlobalText style={styles.aboutWText}>سبک زندگی من</GlobalText>
      <Controller
        name="hobbies_self"
        control={control}
        render={({field}) => (
          <InterestSelector
            options={hobbiesOptions}
            selected={field.value || []}
            maxSelection={5}
            onChange={(values: string[]) => field.onChange(values)}
          />
        )}
      />

      {/* بخش اطلاعات امنیتی */}
      <View style={styles.securitySection}>
        <GlobalText style={styles.stepDescription}>اطلاعات امنیتی</GlobalText>

        <Controller
          name="password"
          control={control}
          render={({field}) => (
            <FormInput
              type="text"
              value={field.value}
              onChange={field.onChange}
              placeholder="رمز عبور برای ورود دوباره"
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({field}) => (
            <FormInput
              type="text"
              value={field.value}
              onChange={field.onChange}
              placeholder="تکرار رمز عبور"
            />
          )}
        />
      </View>
    </>
  );

  return (
    <AuthLayout
      errors={errors}
      submitCount={submitCount}
      cardTitle={stepTitles[step]}
      progress={progress}>
      <View style={{paddingBottom: 95}}>
        {step === 1 && Step1}
        {step === 2 && Step2}
        {step === 3 && Step3}
        {step === 4 && Step4}
      </View>
      <FloatingActionButton
        onPress={goNext}
        icon={step < 4 ? '👈' : '✅'}
        style={[styles.fab, {left: 24}]}
        loading={endStepProfile.isPending}
      />
      {step > 1 && (
        <FloatingActionButton
          icon="👉"
          onPress={goBack}
          style={[styles.fab, {right: 24}]}
        />
      )}
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  securitySection: {},
  aboutWText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 0,
    color: '#fff',
    textAlign: 'right',
  },
  stepDescription: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
    textAlign: 'right',
    marginVertical: 17,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    margin: 6,
    backgroundColor: '#009990',
    borderWidth: 0.8,
    borderColor: '#5fff82ff',
  },
  selectedChipText: {marginRight: 8},

  removeBtn: {paddingLeft: 6, paddingRight: 2},
  removeBtnText: {color: '#d3d2d2ff'},
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tagSelected: {backgroundColor: '#10b98122', borderColor: '#10b981'},
  tagText: {alignSelf: 'flex-start'},
  tagTextSelected: {fontWeight: '700'},
  fab: {position: 'absolute', bottom: 24},
});

export default MultiStepProfile;
