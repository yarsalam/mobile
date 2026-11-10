import React from 'react';
import {View, StyleSheet} from 'react-native';
import { useVerificationStatus } from '../../api/mutations/verification/useVerification';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import FaceVerification from '../../components/image/FaceVerification';


const VerificationScreen = () => {
  const {data: status, isError} = useVerificationStatus();

  return (
    <MainLayout>
      <SectionWithLine text="تأیید هویت" />
      <View style={styles.container}>
        {isError ? (
          <GlobalText style={styles.infoText}>
            سرویس وضعیت و درخواست تأیید هویت هنوز در API کاربر فعال نشده است؛ در حال حاضر امکان ثبت یا تأیید درخواست از داخل اپ وجود ندارد.
          </GlobalText>
        ) : status?.verified ? (
          <GlobalText style={styles.successText}>
            ✅ حساب شما قبلاً تأیید شده است
            {status.badge && ` (${status.badge})`}
          </GlobalText>
        ) : (
          <>
            <GlobalText style={styles.infoText}>
              برای افزایش اعتماد سایر کاربران، هویت خود را با یک عکس سلفی تأیید
              کنید.
            </GlobalText>
            <FaceVerification />
          </>
        )}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  successText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default VerificationScreen;
