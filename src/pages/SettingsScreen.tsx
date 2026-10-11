import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MainLayout from '../theme/MainLayout';
import SectionWithLine from '../components/SectionWithLine';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/rootStackParamList';
import { useTheme } from '../context/MainContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();

  return (
    <MainLayout>
      <SectionWithLine text="تنظیمات" />
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('DisplaySettings')}
        >
          <Text style={[styles.arrow, { color: theme.colors.arrowColor }]}>›</Text>
          <Text style={[styles.optionText, { color: theme.colors.text }]}>تنظیمات نمایش</Text>
        </TouchableOpacity>
        {/* گزینه‌های دیگر تنظیمات در آینده */}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  optionText: { fontSize: 16 },
  arrow: { fontSize: 24, marginLeft: 10 },
});

export default SettingsScreen;