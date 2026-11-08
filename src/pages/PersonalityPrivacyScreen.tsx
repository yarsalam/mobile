import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import MainLayout from '../theme/MainLayout';
import SectionWithLine from '../components/SectionWithLine';
import GlobalText from '../components/GlobalText';
import CustomButton from '../components/CustomButtonProps';
import {useTheme} from '../context/MainContext';
import {useToast} from '../context/ToastContext';
import {fetchWithAuth} from '../lib/fetchWithAuth';

type OceanAxis =
  | 'openness'
  | 'conscientiousness'
  | 'extraversion'
  | 'agreeableness'
  | 'neuroticism';

type TextAssessment = {
  status?: string;
  matchingEligible?: boolean;
  calibrated?: boolean;
  scores?: Partial<
    Record<
      OceanAxis,
      | {
          score: number;
          confidence?: number;
          evidence?: string[];
          confidenceCalibration?: string;
        }
      | null
    >
  >;
  limitations?: string[];
  input?: {
    profileCharacters?: number;
    ownMessageCount?: number;
    totalCharacters?: number;
  };
};

const AXES: {key: OceanAxis; label: string}[] = [
  {key: 'openness', label: 'گشودگی به تجربه'},
  {key: 'conscientiousness', label: 'وظیفه‌شناسی'},
  {key: 'extraversion', label: 'برون‌گرایی'},
  {key: 'agreeableness', label: 'سازگاری'},
  {key: 'neuroticism', label: 'حساسیت هیجانی'},
];

const unwrap = (value: any) => value?.data ?? value;

const PersonalityPrivacyScreen: React.FC = () => {
  const {theme} = useTheme();
  const {showToast} = useToast();
  const [enabled, setEnabled] = useState(false);
  const [loadingConsent, setLoadingConsent] = useState(true);
  const [savingConsent, setSavingConsent] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<TextAssessment | null>(null);
  const [error, setError] = useState('');

  const styles = getStyles(theme);

  useEffect(() => {
    let active = true;
    fetchWithAuth('/personality/text-analysis-consent')
      .then(response => {
        if (active) setEnabled(unwrap(response)?.enabled === true);
      })
      .catch(() => {
        if (active) setError('وضعیت رضایت بارگذاری نشد. اتصال اینترنت را بررسی و دوباره وارد شوید.');
      })
      .finally(() => {
        if (active) setLoadingConsent(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const changeConsent = useCallback(
    async (nextEnabled: boolean) => {
      if (savingConsent) return;
      setSavingConsent(true);
      setError('');
      try {
        const response = await fetchWithAuth('/personality/text-analysis-consent', {
          method: 'PATCH',
          body: JSON.stringify({enabled: nextEnabled}),
        });
        setEnabled(unwrap(response)?.enabled === true);
        if (!nextEnabled) setAssessment(null);
        showToast(
          nextEnabled
            ? 'رضایت تحلیل متنی فعال شد؛ تحلیل هنوز اجرا نشده است.'
            : 'رضایت لغو شد و برآورد ذخیره‌شده حذف شد.',
          'success',
        );
      } catch (requestError: any) {
        setError(requestError?.message || 'ثبت تغییر رضایت ناموفق بود.');
      } finally {
        setSavingConsent(false);
      }
    },
    [savingConsent, showToast],
  );

  const runAnalysis = useCallback(async () => {
    if (!enabled || analyzing) return;
    setAnalyzing(true);
    setError('');
    try {
      const response = await fetchWithAuth('/personality/ocean/text-estimate', {
        method: 'POST',
      });
      setAssessment(unwrap(response) as TextAssessment);
    } catch (requestError: any) {
      setError(requestError?.message || 'تحلیل انجام نشد. بعداً دوباره تلاش کنید.');
    } finally {
      setAnalyzing(false);
    }
  }, [enabled, analyzing]);

  const statusLabel = (status?: string) => {
    switch (status) {
      case 'text_estimate_uncalibrated':
        return 'برآورد متنی با شواهد محدود';
      case 'insufficient_data':
      case 'insufficient_evidence':
        return 'اطلاعات کافی نیست';
      case 'model_response_invalid':
        return 'پاسخ مدل قابل ارزیابی نبود';
      default:
        return status || 'هنوز تحلیلی انجام نشده است';
    }
  };

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionWithLine text="حریم خصوصی و شناخت شخصیت" />

        <View style={styles.card}>
          <GlobalText style={styles.heading}>تحلیل اختیاری متن‌های خودتان</GlobalText>
          <GlobalText style={styles.body}>
            در صورت فعال‌سازی، متن معرفی و علایق ثبت‌شده در پروفایل و حداکثر ۳۰ پیام
            اخیر که خودتان نوشته‌اید برای تهیه یک برآورد آزمایشی پنج‌بُعدی بررسی می‌شود.
          </GlobalText>
          <GlobalText style={styles.notice}>
            برای پردازش، متن انتخاب‌شده به سرویس هوش مصنوعی بیرونیِ پیکربندی‌شده در
            یارسلام فرستاده می‌شود. این تحلیل اختیاری است و برای استفاده از امکانات
            اصلی برنامه اجباری نیست. اطلاعات حساس را در متن‌های خود ننویسید.
          </GlobalText>
          <GlobalText style={styles.body}>
            این برآورد آزمون روان‌سنجی معتبر یا تشخیص پزشکی نیست؛ دقت و اطمینان آن
            کالیبره نشده و در رتبه‌بندی یا امتیاز تطبیق افراد استفاده نمی‌شود.
          </GlobalText>
        </View>

        <View style={styles.consentRow}>
          <View style={styles.consentText}>
            <GlobalText style={styles.heading}>رضایت برای تحلیل متنی</GlobalText>
            <GlobalText style={styles.muted}>
              {enabled ? 'فعال است؛ تحلیل فقط با درخواست شما اجرا می‌شود.' : 'غیرفعال است.'}
            </GlobalText>
          </View>
          {loadingConsent || savingConsent ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Switch
              value={enabled}
              onValueChange={changeConsent}
              trackColor={{false: theme.colors.border, true: theme.colors.primary}}
              disabled={loadingConsent || savingConsent}
              accessibilityLabel="رضایت برای تحلیل متنی شخصیت"
            />
          )}
        </View>

        {enabled ? (
          <CustomButton
            label="اجرای تحلیل با متن‌های خودم"
            onPress={runAnalysis}
            loading={analyzing}
            disabled={analyzing || loadingConsent || savingConsent}
            gradient
            style={styles.action}
          />
        ) : null}

        {error ? <GlobalText style={styles.error}>{error}</GlobalText> : null}

        {assessment ? (
          <View style={styles.card}>
            <GlobalText style={styles.heading}>نتیجهٔ آزمایشی</GlobalText>
            <GlobalText style={styles.status}>{statusLabel(assessment.status)}</GlobalText>
            <GlobalText style={styles.muted}>
              این امتیازها خام و کالیبره‌نشده‌اند و در تطبیق افراد نقشی ندارند.
            </GlobalText>
            {AXES.map(axis => {
              const value = assessment.scores?.[axis.key];
              return (
                <View key={axis.key} style={styles.axis}>
                  <GlobalText style={styles.axisTitle}>{axis.label}</GlobalText>
                  {value && Number.isFinite(value.score) ? (
                    <>
                      <GlobalText style={styles.score}>
                        {value.score.toFixed(2)} از ۱
                      </GlobalText>
                      {(value.evidence || []).map((quote, index) => (
                        <GlobalText key={index} style={styles.quote}>
                          «{quote}»
                        </GlobalText>
                      ))}
                    </>
                  ) : (
                    <GlobalText style={styles.muted}>شواهد کافی برای برآورد وجود ندارد.</GlobalText>
                  )}
                </View>
              );
            })}
            {(assessment.limitations || []).map((item, index) => (
              <GlobalText key={index} style={styles.muted}>
                • {item}
              </GlobalText>
            ))}
          </View>
        ) : null}

        {loadingConsent ? (
          <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
        ) : null}
      </ScrollView>
    </MainLayout>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {padding: 16, paddingBottom: 32},
    card: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      gap: 10,
    },
    heading: {fontSize: 16, fontWeight: 'bold'},
    body: {fontSize: 14, lineHeight: 24, color: theme.colors.text},
    notice: {
      fontSize: 14,
      lineHeight: 24,
      color: theme.colors.text,
      backgroundColor: theme.colors.textBackground,
      padding: 10,
      borderRadius: 8,
    },
    consentRow: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      marginBottom: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    consentText: {flex: 1, paddingRight: 12, gap: 5},
    muted: {fontSize: 13, lineHeight: 21, color: theme.colors.disabledText},
    action: {marginBottom: 14},
    error: {color: '#d32f2f', marginBottom: 12, textAlign: 'center'},
    status: {fontSize: 14, fontWeight: 'bold'},
    axis: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: 10,
      gap: 6,
    },
    axisTitle: {fontSize: 15, fontWeight: 'bold'},
    score: {fontSize: 14, color: theme.colors.primary, fontWeight: 'bold'},
    quote: {fontSize: 13, lineHeight: 21, color: theme.colors.text},
    loading: {marginVertical: 16},
  });

export default PersonalityPrivacyScreen;
