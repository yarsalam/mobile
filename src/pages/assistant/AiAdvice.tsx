import React from 'react';
import {ScrollView, View, StyleSheet, ActivityIndicator} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {useAdvice} from '../../api/mutations/assistant/aiAssistantHooks';
import FeedbackWidget from '../../components/user/FeedbackWidget';


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
