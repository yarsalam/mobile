import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import GlobalText from '../GlobalText';
import {useTheme} from '../../context/MainContext';
import {
  useRunTextOceanEstimate,
  useSetTextAnalysisConsent,
  useTextAnalysisConsent,
  useTextOceanEstimate,
  type TextOceanAssessment,
} from '../../api/mutations/personality/useTextPersonality';

const AXES = [
  ['openness', 'گشودگی به تجربه'],
  ['conscientiousness', 'وظیفه‌شناسی'],
  ['extraversion', 'برون‌گرایی'],
  ['agreeableness', 'توافق‌پذیری'],
  ['neuroticism', 'حساسیت هیجانی'],
] as const;

function unwrapAssessment(value: any): TextOceanAssessment | null {
  return value?.assessment ?? value ?? null;
}

export default function TextPersonalityAnalysisCard() {
  const {theme} = useTheme();
  const consentQuery = useTextAnalysisConsent();
  const enabled = consentQuery.data?.enabled === true;
  const estimateQuery = useTextOceanEstimate(enabled);
  const consentMutation = useSetTextAnalysisConsent();
  const estimateMutation = useRunTextOceanEstimate();

  const assessment = unwrapAssessment(estimateQuery.data);

  const enableConsent = () => {
    Alert.alert(
      'رضایت برای تحلیل متن',
      'با تأیید شما، متن «درباره من»، سرگرمی‌ها و ارزش‌های ثبت‌شده و حداکثر ۳۰ پیام ارسالی و حذف‌نشده خودتان برای برآورد پنج بُعد OCEAN تحلیل می‌شود. اطلاعات تماس و پیوندها پیش از تحلیل پالایش می‌شوند. برای پردازش، متن انتخاب‌شده به سرویس هوش مصنوعی بیرونیِ پیکربندی‌شده در یارسلام ارسال می‌شود؛ نگهداری یا پردازش بعدی در سمت ارائه‌دهنده تابع سیاست همان سرویس است. اطلاعات حساس را در متن ننویسید. این برآورد آزمون روان‌سنجی معتبر یا تشخیص بالینی نیست و در Matching استفاده نمی‌شود.',
      [
        {text: 'انصراف', style: 'cancel'},
        {text: 'می‌پذیرم', onPress: () => consentMutation.mutate(true)},
      ],
    );
  };

  const withdrawConsent = () => {
    Alert.alert(
      'لغو رضایت',
      'با لغو رضایت، برآورد متنی ذخیره‌شده اخیر نیز از نمایه شما پاک می‌شود. پرسش‌نامه شخصیت موجود تغییر نمی‌کند.',
      [
        {text: 'بازگشت', style: 'cancel'},
        {
          text: 'لغو رضایت',
          style: 'destructive',
          onPress: () => consentMutation.mutate(false),
        },
      ],
    );
  };

  const runEstimate = () => {
    if (!enabled) return;
    estimateMutation.mutate(undefined, {
      onError: (error: any) =>
        Alert.alert('تحلیل انجام نشد', error?.message || 'لطفاً بعداً دوباره تلاش کنید.'),
    });
  };

  return (
    <View style={[styles.card, {backgroundColor: theme.colors.card, borderColor: theme.colors.border}]}>
      <GlobalText style={[styles.title, {color: theme.colors.text}]}>
        تحلیل شخصیت از نوشته‌های خودم (OCEAN)
      </GlobalText>
      <GlobalText style={[styles.description, {color: theme.colors.text}]}>
        این قابلیت با رضایت جداگانه، متن‌های خود شما را برای یافتن شواهد احتمالی پنج بُعد شخصیت بررسی می‌کند. نتیجه تقریبی و کالیبره‌نشده است و جایگزین پرسش‌نامه نیست.
      </GlobalText>

      {consentQuery.isLoading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : consentQuery.isError ? (
        <View>
          <GlobalText style={{color: theme.colors.text}}>
            وضعیت رضایت دریافت نشد؛ تا زمان تأیید وضعیت، تحلیل غیرفعال است.
          </GlobalText>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => consentQuery.refetch()}>
            <GlobalText style={styles.buttonText}>تلاش دوباره</GlobalText>
          </TouchableOpacity>
        </View>
      ) : !enabled ? (
        <TouchableOpacity
          style={[styles.primaryButton, {backgroundColor: theme.colors.primary}]}
          disabled={consentMutation.isPending}
          onPress={enableConsent}>
          {consentMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <GlobalText style={styles.buttonText}>مطالعه توضیحات و اعلام رضایت</GlobalText>
          )}
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.consentRow}>
            <GlobalText style={[styles.enabledText, {color: theme.colors.text}]}>
              رضایت فعال است
            </GlobalText>
            <TouchableOpacity
              disabled={consentMutation.isPending}
              onPress={withdrawConsent}>
              <GlobalText style={styles.withdrawText}>لغو رضایت</GlobalText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, {backgroundColor: theme.colors.primary}]}
            disabled={estimateMutation.isPending || consentMutation.isPending}
            onPress={runEstimate}>
            {estimateMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <GlobalText style={styles.buttonText}>تحلیل متن‌های من</GlobalText>
            )}
          </TouchableOpacity>

          {estimateQuery.isLoading ? (
            <ActivityIndicator color={theme.colors.primary} style={{marginTop: 14}} />
          ) : estimateQuery.isError ? (
            <GlobalText style={{color: theme.colors.text, marginTop: 12}}>
              نتیجه قبلی دریافت نشد. می‌توانید دوباره تلاش کنید.
            </GlobalText>
          ) : assessment ? (
            <View style={styles.results}>
              <GlobalText style={[styles.resultHeading, {color: theme.colors.text}]}>
                {assessment.status === 'text_estimate_uncalibrated'
                  ? 'برآورد متنی (اعتبارسنجی‌نشده)'
                  : assessment.status === 'insufficient_data' || assessment.status === 'insufficient_evidence'
                    ? 'شواهد کافی برای برآورد وجود ندارد'
                    : 'وضعیت برآورد'}
              </GlobalText>
              {assessment.input ? (
                <GlobalText style={[styles.meta, {color: theme.colors.text}]}>
                  حجم متن بررسی‌شده: {assessment.input.totalCharacters ?? 0} نویسه · پیام‌های خود شما: {assessment.input.ownMessageCount ?? 0}
                </GlobalText>
              ) : null}
              {AXES.map(([key, label]) => {
                const dimension = assessment.scores?.[key];
                return (
                  <View key={key} style={[styles.axis, {borderBottomColor: theme.colors.border}]}>
                    <GlobalText style={[styles.axisTitle, {color: theme.colors.text}]}>{label}</GlobalText>
                    {dimension ? (
                      <>
                        <GlobalText style={{color: theme.colors.text}}>
                          برآورد: {Math.round(dimension.score * 100)} از ۱۰۰ · اطمینان مدل: حداکثر ۵۰٪ و کالیبره‌نشده
                        </GlobalText>
                        {dimension.evidence.map((quote, index) => (
                          <GlobalText key={index} style={[styles.evidence, {color: theme.colors.text}]}>
                            «{quote}»
                          </GlobalText>
                        ))}
                      </>
                    ) : (
                      <GlobalText style={[styles.meta, {color: theme.colors.text}]}>
                        شواهد کافی برای این بُعد ثبت نشده است.
                      </GlobalText>
                    )}
                  </View>
                );
              })}
              {(assessment.limitations ?? []).map((item, index) => (
                <GlobalText key={index} style={[styles.limitation, {color: theme.colors.text}]}>
                  • {item}
                </GlobalText>
              ))}
              <GlobalText style={[styles.footer, {color: theme.colors.text}]}>
                این برآورد در Matching، رتبه‌بندی یا تصمیم‌گیری درباره دیگران استفاده نمی‌شود.
              </GlobalText>
            </View>
          ) : (
            <GlobalText style={[styles.meta, {color: theme.colors.text, marginTop: 12}]}>
              هنوز برآورد متنی ذخیره‌شده‌ای ندارید. برای شروع، دکمه تحلیل را بزنید.
            </GlobalText>
          )}
        </>
      )}

      {consentMutation.isError ? (
        <GlobalText style={styles.error}>ثبت تغییر رضایت ناموفق بود. وضعیت را دوباره بررسی کنید.</GlobalText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 16},
  title: {fontSize: 17, fontWeight: 'bold', textAlign: 'right', marginBottom: 8},
  description: {fontSize: 13, lineHeight: 22, textAlign: 'right', marginBottom: 14},
  primaryButton: {minHeight: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, marginTop: 8},
  secondaryButton: {minHeight: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, marginTop: 10, backgroundColor: '#64748b'},
  buttonText: {color: '#fff', fontWeight: 'bold'},
  consentRow: {flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6},
  enabledText: {fontSize: 13, fontWeight: '600'},
  withdrawText: {color: '#dc2626', fontWeight: '600'},
  results: {marginTop: 16},
  resultHeading: {fontWeight: 'bold', fontSize: 15, textAlign: 'right', marginBottom: 6},
  meta: {fontSize: 12, lineHeight: 20, textAlign: 'right'},
  axis: {paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth},
  axisTitle: {fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginBottom: 4},
  evidence: {fontSize: 12, lineHeight: 20, textAlign: 'right', marginTop: 4, fontStyle: 'italic'},
  limitation: {fontSize: 12, lineHeight: 20, textAlign: 'right', marginTop: 5},
  footer: {fontSize: 11, lineHeight: 18, textAlign: 'right', marginTop: 12, opacity: 0.8},
  error: {color: '#dc2626', textAlign: 'right', marginTop: 10},
});
