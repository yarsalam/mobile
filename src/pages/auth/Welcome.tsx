import React from 'react';
import {StyleSheet} from 'react-native';
import CustomButton from '../../components/CustomButtonProps';
import GlobalText from '../../components/GlobalText';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';
import AuthLayout from '../../components/user/AuthLayout';

type WelcomeProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;
const Welcome: React.FC<WelcomeProps> = ({navigation}) => {
  return (
    <AuthLayout cardTitle="! توجه !" cardTitleStyle={styles.cardTitle}>
      <GlobalText style={styles.welcomeText}>به یارسلام خوشامدید</GlobalText>
      <GlobalText style={styles.warningText}>
        ضمن کلیک بر روی دکمه زیر برای تکمیل پروفایلتان، توجه داشته باشید کاربران
        بر اساس اطلاعات فرم‌های شما معرفی خواهند شد. لطفا در پر کردن فرم‌ها دقت
        کنید.
      </GlobalText>

      <CustomButton
        label="تکمیل پروفایل"
        onPress={() => navigation.navigate('multiStepProfile')}
        gradient={true}
        style={{marginTop: 50}}
      />
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  welcomeText: {fontSize: 30, textAlign: 'center', fontWeight: 'bold'},
  warningText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
  },
});

export default Welcome;
