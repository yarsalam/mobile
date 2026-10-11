import React, {useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MainLayout from '../theme/MainLayout';
import SectionWithLine from '../components/SectionWithLine';
import GlobalText from '../components/GlobalText';
import CustomButton from '../components/CustomButtonProps';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/MainContext';
import {fetchWithAuth} from '../lib/fetchWithAuth';
import {useToast} from '../context/ToastContext';
import FormCard from '../components/FormCard';

const AccountActionsScreen = () => {
  const {user, logout} = useAuth();
  const {theme} = useTheme();
  const {showToast} = useToast();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'suspend' | 'resign' | null>(
    null,
  );
  const styles = getStyles(theme);
  const openModal = (action: 'suspend' | 'resign') => {
    setModalAction(action);
    setModalVisible(true);
  };

  const performAction = async () => {
    if (!user || !modalAction) return;
    setLoading(true);
    try {
      await fetchWithAuth(
        `http://192.168.0.133:5001/users/${user.id}/${modalAction}`,
        {
          method: 'PATCH',
        },
      );
      showToast(
        modalAction === 'suspend'
          ? 'پروفایل شما تعلیق شد'
          : 'حساب شما غیرفعال شد',
        'success',
      );
      setModalVisible(false);
      await logout();
    } catch (error: any) {
      showToast(error.message || 'خطا در انجام عملیات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const modalTitle =
    modalAction === 'suspend' ? 'تعلیق پروفایل' : 'انصراف از یارسلام';
  const modalDescription =
    modalAction === 'suspend'
      ? 'با تأیید این گزینه، پروفایل شما برای دیگران نمایش داده نمی‌شود. عضویت ویژه شما حذف نمی‌شود اما در موعد مقرر به پایان خواهد رسید. با ورود مجدد، پروفایل به‌طور خودکار فعال می‌گردد.'
      : 'با تأیید این گزینه، حساب شما غیرفعال می‌شود. اطلاعات شما حفظ می‌شود اما دیگران نمی‌توانند پروفایل شما را ببینند یا با شما تعامل کنند. در صورت تمایل می‌توانید بعداً با همان شماره موبایل دوباره ثبت‌نام کنید.';

  return (
    <MainLayout>
      <SectionWithLine text="مدیریت حساب" />
      <ScrollView contentContainerStyle={styles.container}>
        <FormCard style={{marginBottom: 17}}>
          <GlobalText style={styles.description}>
            شما می‌توانید حساب خود را موقتاً تعلیق کنید تا پروفایلتان برای
            دیگران نمایش داده نشود، یا برای همیشه از یارسلام انصراف دهید.
          </GlobalText>
        </FormCard>

        <View style={styles.buttonGroup}>
          <CustomButton
            label="تعلیق پروفایل"
            onPress={() => openModal('suspend')}
            gradient
            disabled={loading}
            style={styles.button}
          />
          <CustomButton
            label="انصراف از یارسلام"
            onPress={() => openModal('resign')}
            style={[styles.button, {backgroundColor: '#e74c3c'}]}
            gradient
            disabled={loading}
          />
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContainer,
                {backgroundColor: theme.colors.card},
              ]}>
              <GlobalText style={styles.modalTitle}>{modalTitle}</GlobalText>
              <GlobalText style={styles.modalMessage}>
                {modalDescription}
              </GlobalText>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  disabled={loading}>
                  <GlobalText style={styles.cancelText}>انصراف</GlobalText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={performAction}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <GlobalText style={styles.confirmText}>تأیید</GlobalText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </MainLayout>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      justifyContent: 'flex-start', // چسبیدن به بالا
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      paddingVertical: 30,
      lineHeight: 24,
      color: theme.colors.text,
    },
    buttonGroup: {
      gap: 10,
    },
    button: {
      marginBottom: 0,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '85%',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
    },
    modalMessage: {
      fontSize: 15,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 20,
      color: '#555',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: 10,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    cancelButton: {backgroundColor: '#ccc'},
    confirmButton: {backgroundColor: '#e74c3c'},
    cancelText: {color: '#333', fontWeight: 'bold'},
    confirmText: {color: '#fff', fontWeight: 'bold'},
  });

export default AccountActionsScreen;
