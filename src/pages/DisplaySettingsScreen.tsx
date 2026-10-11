import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MainLayout from '../theme/MainLayout';
import SectionWithLine from '../components/SectionWithLine';
import { useTheme } from '../context/MainContext';
import { AppTheme, allThemes } from '../theme/theme';
import CustomButton from '../components/CustomButtonProps';
import GlobalText from '../components/GlobalText';
import LinearGradient from 'react-native-linear-gradient';

// یک ماکت ساده از بخش‌های مختلف UserPanel با رنگ‌های داده‌شده
const PreviewCard = ({ theme }: { theme: AppTheme }) => (
  <View style={[styles.previewCard, { borderColor: theme.colors.border }]}>
    <LinearGradient colors={theme.backgroundGradient} style={styles.previewBackground} />
    {/* هدر کوچک */}
    <View style={[styles.mockHeader, { backgroundColor: theme.colors.card }]}>
      <GlobalText style={{ color: theme.colors.text, fontWeight: 'bold' }}>پیش‌نمایش</GlobalText>
    </View>
    {/* ردیف آیکون‌ها */}
    <View style={styles.mockRow}>
      <View style={[styles.mockIcon, { backgroundColor: theme.colors.primary }]} />
      <View style={[styles.mockIcon, { backgroundColor: theme.colors.primary }]} />
      <View style={[styles.mockIcon, { backgroundColor: theme.colors.primary }]} />
    </View>
    {/* کارت محتوا */}
    <View style={[styles.mockCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <GlobalText style={{ color: theme.colors.text }}>عنوان کارت</GlobalText>
      <GlobalText style={{ color: theme.colors.disabledText, fontSize: 12 }}>توضیح کوتاه</GlobalText>
    </View>
    {/* دکمه */}
    <View style={[styles.mockButton, { backgroundColor: theme.colors.primary }]}>
      <GlobalText style={{ color: '#fff' }}>دکمه</GlobalText>
    </View>
    {/* انتخاب‌گر */}
    <View style={styles.mockDropdown}>
      <View style={[styles.dropdownBox, { backgroundColor: theme.colors.dropdownBackground, borderColor: theme.colors.border }]}>
        <GlobalText style={{ color: theme.colors.text }}>گزینه ▼</GlobalText>
      </View>
    </View>
    {/* پس‌زمینه‌های دیگر */}
    <View style={[styles.mockRow, { marginTop: 8 }]}>
      <View style={[styles.colorChip, { backgroundColor: theme.colors.textBackground }]}>
        <GlobalText style={{ color: theme.colors.text, fontSize: 10 }}>textBg</GlobalText>
      </View>
      <View style={[styles.colorChip, { backgroundColor: theme.colors.optionBackground }]}>
        <GlobalText style={{ color: theme.colors.text, fontSize: 10 }}>optionBg</GlobalText>
      </View>
      <View style={[styles.colorChip, { backgroundColor: theme.colors.disabledBackground }]}>
        <GlobalText style={{ color: theme.colors.disabledText, fontSize: 10 }}>disabled</GlobalText>
      </View>
    </View>
  </View>
);

const DisplaySettingsScreen: React.FC = () => {
  const { setThemeName, themeName } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<AppTheme>(
    allThemes.find(t => t.name === themeName) || allThemes[0]
  );

  const handleSelect = (theme: AppTheme) => {
    setPreviewTheme(theme);
  };

  const handleApply = () => {
    setThemeName(previewTheme.name);
    // optionally show toast
  };

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionWithLine text="تنظیمات نمایش" />
        <GlobalText style={styles.sectionTitle}>پیش‌نمایش رنگ‌ها</GlobalText>

        {/* انتخاب‌کننده افقی */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeList}>
          {allThemes.map(theme => (
            <TouchableOpacity
              key={theme.name}
              onPress={() => handleSelect(theme)}
              style={[
                styles.themeItem,
                {
                  backgroundColor: theme.backgroundGradient[0],
                  borderColor: previewTheme.name === theme.name ? '#FFD700' : 'transparent',
                  borderWidth: 2,
                },
              ]}
            >
              <GlobalText style={[styles.themeName, { color: theme.colors.text }]}>
                {theme.name}
              </GlobalText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* کارت پیش‌نمایش */}
        <PreviewCard theme={previewTheme} />

        <CustomButton
          label="اعمال این تم"
          onPress={handleApply}
          gradient
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  themeList: { flexDirection: 'row', marginBottom: 20, paddingVertical: 8 },
  themeItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeName: { fontSize: 12 },
  previewCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 12,
    paddingBottom: 16,
  },
  previewBackground: { ...StyleSheet.absoluteFill, borderRadius: 16 },
  mockHeader: {
    margin: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  mockRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8, gap: 12 },
  mockIcon: { width: 30, height: 30, borderRadius: 6 },
  mockCard: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  mockButton: {
    marginHorizontal: 40,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  mockDropdown: { marginHorizontal: 16, marginBottom: 8 },
  dropdownBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  colorChip: {
    padding: 6,
    borderRadius: 6,
    width: 70,
    alignItems: 'center',
  },
});

export default DisplaySettingsScreen;