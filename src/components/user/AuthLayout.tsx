import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Layout from '../../theme/Layout';
import ToastHandler from '../ToastHandler';
import MainImage from '../image/MainImage';
import ProgressBar from '../ProgressBar';
import FormCard from '../FormCard';
import { useTheme } from '../../context/MainContext';

interface AuthLayoutProps {
  showMainImage?: boolean;
  errors?: any;
  submitCount?: number;
  children?: React.ReactNode;
  cardTitle?: string;
  cardTitleStyle?: object;
  progress?: number;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  showMainImage = true,
  errors,
  submitCount,
  children,
  cardTitle = 'ثبت نام در یارسلام',
  cardTitleStyle = { paddingTop: 20, paddingBottom: 30 },
  progress,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <Layout>
          <View style={styles.header}>{showMainImage && <MainImage />}</View>

          {/* 🔁 کارت یکسان با Login */}
          <FormCard title={cardTitle} titleStyle={cardTitleStyle}>
            <ToastHandler errors={errors} submitCount={submitCount} />
            {progress !== undefined && <ProgressBar progress={progress} />}
            {children}
          </FormCard>
        </Layout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    header: { alignItems: 'center' },
  });

export default AuthLayout;