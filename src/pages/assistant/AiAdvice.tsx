import React from 'react';
import {ScrollView, View, StyleSheet, ActivityIndicator, Switch, TouchableOpacity, Alert} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {useAdvice} from '../../api/mutations/assistant/aiAssistantHooks';
import FeedbackWidget from '../../components/user/FeedbackWidget';
import {
  useAnalyzePersonalityText,
  usePersonalityTextConsent,
  usePersonalityTextEstimate,
  useSetPersonalityTextConsent,
} from '../../api/mutations/assistant/personalityTextHooks';



const OCEAN_DIMENSIONS = [
  {key: 'openness', label: 'گشودگی به تجربه'},
  {key: 'conscientiousness', label: 'وظیفه‌شناسی'},
  {key: 'extraversion', label: 'برون‌گرایی'},
  {key: 'agreeableness', label: 'توافق‌پذیری'},
  {key: 'neuroticism', label: 'حساسیت هیجانی'},
] as const;

const PersonalityTextAnalysisCard = () => {
  const {theme} = useTheme();
  const consentQuery = usePersonalityTextConsent();
  const enabled = consentQuery.data?.enabled === true;
  const estimateQuery = usePersonalityTextEstimate(enabled);
  const consentMutation = useSetPersonalityTextConsent();
  const analyzeMutation = useAnalyzePersonalityText();
  const assessment = estimateQuery.data?.assessment ?? null;

  const requestConsentChange = (nextEnabled: boolean) => {
    Alert.alert(
      nextEnabled ? 'رضایت برای تحلیل شخصیت از متن' : 'لغو رضایت تحلیل متنی',
      nextEnabled
        ? 'با فعال‌سازی، معرفی‌نامه، علایق، ارزش‌های خوداظهاری و حداکثر ۳۰ پیام ارسالی خودت برای یک برآورد محتاطانه OCEAN پردازش می‌شوند. اطلاعات تماس و پیوندها حذف می‌شوند. این نتیجه تشخیص یا آزمون روان‌سنجی معتبر نیست و در Matching استفاده نمی‌شود.'
        : 'با لغو رضایت، تحلیل متنی ذخیره‌شده نیز از پروفایل حذف می‌شود. پرسش‌نامه شخصیت و سایر اطلاعات پروفایل حذف نخواهند شد.',
      [
        {text: 'انصراف', style: 'cancel'},
        {
          text: nextEnabled ? 'رضایت می‌دهم' : 'لغو رضایت',
          style: nextEnabled ? 'default' : 'destructive',
          onPress: () =>
            consentMutation.mutate(nextEnabled, {
              onError: () =>
                Alert.alert('خطا', 'ثبت تغییر رضایت انجام نشد. دوباره تلاش کنید.'),
            }),
        },
      ],
    );
  };

  const runTextAnalysis = () => {
    if (!enabled) return;
    analyzeMutation.mutate(undefined, {
      onError: (error: any) =>
        Alert.alert(
          'تحلیل انجام نشد',
          error?.response?.data?.message ?? 'لطفاً بعداً دوباره تلاش کنید.',
        ),
    });
  };

  return (
    <View style={[styles.card, {backgroundColor: theme.colors.card}]}>
      <GlobalText style={styles.sectionTitle}>تحلیل شخصیت OCEAN از متن</GlobalText>
      <GlobalText style={styles.personalityDescription}>
        این قابلیت از متن‌هایی که خودت نوشته‌ای استفاده می‌کند؛ نه صرفاً از
        فیلدهای دیتابیس. تحلیل فقط با رضایت جداگانه انجام می‌شود و نتیجه آن
        تخمین غیرکالیبره است، نه تشخیص روان‌شناختی.
      </GlobalText>

      {consentQuery.isLoading ? (
        <ActivityIndicator size="small" style={{marginVertical: 12}} />
      ) : consentQuery.isError ? (
        <View>
          <GlobalText style={styles.personalityMuted}>
            وضعیت رضایت بارگذاری نشد؛ تا زمان تأیید وضعیت، تحلیل اجرا نمی‌شود.
          </GlobalText>
          <TouchableOpacity onPress={() => consentQuery.refetch()}>
            <GlobalText style={styles.personalityAction}>تلاش دوباره</GlobalText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.personalityConsentRow}>
          <View style={styles.personalityConsentText}>
            <GlobalText style={styles.personalityConsentTitle}>
              {enabled ? 'رضایت فعال است' : 'رضایت غیرفعال است'}
            </GlobalText>
            <GlobalText style={styles.personalityMuted}>
              {enabled
                ? 'هر زمان بخواهی می‌توانی رضایت را لغو کنی.'
                : 'بدون فعال‌سازی این گزینه هیچ تحلیل متنی انجام نمی‌شود.'}
            </GlobalText>
          </View>
          <Switch
            value={enabled}
            onValueChange={requestConsentChange}
            disabled={consentMutation.isPending}
            trackColor={{false: '#9ca3af', true: theme.colors.primary}}
          />
        </View>
      )}

      {consentMutation.isPending && (
        <ActivityIndicator size="small" style={{marginVertical: 8}} />
      )}

      {enabled && (
        <TouchableOpacity
          style={[styles.personalityAnalyzeButton, {backgroundColor: theme.colors.primary}]}
          onPress={runTextAnalysis}
          disabled={analyzeMutation.isPending || estimateQuery.isFetching}>
          {analyzeMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <GlobalText style={styles.personalityAnalyzeText}>
              تحلیل متن‌های خودم
            </GlobalText>
          )}
        </TouchableOpacity>
      )}

      {estimateQuery.isFetching && (
        <ActivityIndicator size="small" style={{marginVertical: 10}} />
      )}

      {estimateQuery.isError && (
        <GlobalText style={styles.personalityMuted}>
          دریافت آخرین برآورد ممکن نشد. اتصال را بررسی و دوباره تلاش کن.
        </GlobalText>
      )}

      {enabled && assessment && (
        <View style={styles.personalityResult}>
          <GlobalText style={styles.personalityStatus}>
            {assessment.status === 'text_estimate_uncalibrated'
              ? 'برآورد متنی — غیرکالیبره'
              : assessment.status === 'insufficient_data'
                ? 'متن کافی برای برآورد وجود ندارد'
                : 'شواهد متنی کافی نیست'}
          </GlobalText>
          {assessment.input && (
            <GlobalText style={styles.personalityMuted}>
              تعداد نویسه‌ها: {assessment.input.totalCharacters} · پیام‌های ارسالی بررسی‌شده: {assessment.input.ownMessageCount}
              {assessment.minimumTextCharacters
                ? ' · حداقل لازم: ' + assessment.minimumTextCharacters
                : ''}
            </GlobalText>
          )}
          {OCEAN_DIMENSIONS.map(({key, label}) => {
            const dimension = assessment.scores?.[key];
            return (
              <View key={key} style={styles.personalityDimension}>
                <View style={styles.personalityDimensionHeader}>
                  <GlobalText style={styles.personalityDimensionTitle}>{label}</GlobalText>
                  <GlobalText style={styles.personalityScore}>
                    {dimension?.score == null
                      ? 'شواهد کافی نیست'
                      : Math.round(dimension.score * 100) + ' از ۱۰۰'}
                  </GlobalText>
                </View>
                {dimension && (
                  <>
                    <GlobalText style={styles.personalityMuted}>
                      اطمینان مدل: غیرکالیبره و فاقد تفسیر احتمالاتی
                    </GlobalText>
                    {dimension.evidence.map((quote, index) => (
                      <GlobalText key={index} style={styles.personalityEvidence}>
                        «{quote}»
                      </GlobalText>
                    ))}
                  </>
                )}
              </View>
            );
          })}
          {assessment.limitations?.map((item, index) => (
            <GlobalText key={index} style={styles.personalityMuted}>
              • {item}
            </GlobalText>
          ))}
          <GlobalText style={styles.personalityFooter}>
            این برآورد به‌هیچ‌وجه برای امتیازدهی یا رتبه‌بندی Matching استفاده نمی‌شود.
          </GlobalText>
        </View>
      )}

      {!enabled && (
        <GlobalText style={styles.personalityMuted}>
          برای شروع، ابتدا توضیحات رضایت را بخوان و در صورت تمایل گزینه را فعال کن.
        </GlobalText>
      )}
    </View>
  );
};

const AiAdvice = () => {
  const {theme} = useTheme();
  const {data: advice, isLoading} = useAdvice();

  if (isLoading)
    return <ActivityIndicator size="large" style={{marginTop: 50}} />;

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={{padding: 16}}>
        <SectionWithLine text="مشاوره هوشمند" />
        <FeedbackWidget feature="assistant" context="guidance_123" />
        <PersonalityTextAnalysisCard />
        {/* خلاصه */}
        <View style={[styles.card, {backgroundColor: theme.colors.card}]}>
          <GlobalText style={styles.sectionTitle}>خلاصه وضعیت</GlobalText>
          <GlobalText>فاز فعلی: {advice?.summary.currentPhase}</GlobalText>
          <GlobalText>فاز هدف: {advice?.summary.nextPhase}</GlobalText>
          <GlobalText>تعداد مشکلات: {advice?.summary.problemsCount}</GlobalText>
        </View>

        {/* مشکلات اصلی */}
        <View style={[styles.card, {backgroundColor: theme.colors.card}]}>
          <GlobalText style={styles.sectionTitle}>مشکلات اصلی</GlobalText>
          {advice?.topProblems.map((p: any, i: number) => (
            <View key={i} style={styles.problemItem}>
              <GlobalText style={styles.problemDesc}>
                {p.description}
              </GlobalText>
              <GlobalText style={styles.problemImpact}>{p.impact}</GlobalText>
            </View>
          ))}
        </View>

        {/* راهنمایی بعدی */}
        {advice?.nextGuidance && (
          <View style={[styles.card, {backgroundColor: '#e6f7ff'}]}>
            <GlobalText style={styles.sectionTitle}>راهنمایی ویژه</GlobalText>
            <GlobalText style={styles.guidanceMessage}>
              {advice.nextGuidance.message}
            </GlobalText>
            {advice.nextGuidance.action?.target && (
              <GlobalText style={styles.actionText}>
                اقدام: {advice.nextGuidance.action.target}
              </GlobalText>
            )}
          </View>
        )}

        {/* برنامه رشد */}
        {advice?.optimizationPlan && (
          <View style={[styles.card, {backgroundColor: theme.colors.card}]}>
            <GlobalText style={styles.sectionTitle}>برنامه رشد</GlobalText>
            <GlobalText>
              زمان تخمینی تا فاز بعدی:{' '}
              {advice.optimizationPlan.estimatedTimeToNextPhase}
            </GlobalText>
            {advice.optimizationPlan.steps.map((step: any, idx: number) => (
              <View key={idx} style={styles.step}>
                <GlobalText>
                  {step.order}. {step.action}
                </GlobalText>
                <GlobalText style={styles.stepImpact}>
                  {step.expectedImpact}
                </GlobalText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  personalityDescription: {fontSize: 13, lineHeight: 21, opacity: 0.8, marginBottom: 12},
  personalityConsentRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10},
  personalityConsentText: {flex: 1, paddingRight: 12},
  personalityConsentTitle: {fontSize: 14, fontWeight: 'bold'},
  personalityMuted: {fontSize: 12, lineHeight: 19, color: '#6b7280', marginTop: 4},
  personalityAction: {color: '#2563eb', fontWeight: 'bold', marginTop: 8},
  personalityAnalyzeButton: {borderRadius: 10, padding: 12, alignItems: 'center', marginVertical: 10},
  personalityAnalyzeText: {color: '#fff', fontWeight: 'bold'},
  personalityResult: {marginTop: 12, gap: 10},
  personalityStatus: {fontSize: 14, fontWeight: 'bold'},
  personalityDimension: {paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#9ca3af'},
  personalityDimensionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  personalityDimensionTitle: {fontWeight: 'bold', fontSize: 13},
  personalityScore: {fontWeight: 'bold', color: '#2563eb', fontSize: 13},
  personalityEvidence: {fontSize: 12, lineHeight: 18, marginTop: 4, fontStyle: 'italic'},
  personalityFooter: {fontSize: 12, lineHeight: 18, fontWeight: 'bold', marginTop: 6},
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  problemItem: {
    marginBottom: 10,
  },
  problemDesc: {
    fontWeight: '600',
    fontSize: 15,
  },
  problemImpact: {
    color: '#2a76a8',
    marginTop: 4,
  },
  guidanceMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a5',
  },
  actionText: {
    marginTop: 8,
    color: '#888',
  },
  step: {
    marginTop: 8,
  },
  stepImpact: {
    color: '#666',
    fontSize: 13,
  },
});

export default AiAdvice;
