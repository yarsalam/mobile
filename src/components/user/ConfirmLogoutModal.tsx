import React from 'react';
import {Modal, View, StyleSheet, TouchableOpacity} from 'react-native';
import GlobalText from '../GlobalText';
import {useTheme} from '../../context/MainContext';
import {transformer} from 'zod';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmLogoutModal: React.FC<Props> = ({
  visible,
  onCancel,
  onConfirm,
  loading,
}) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.box,
            {
              backgroundColor: theme.colors.background + 'cc',
              borderColor: theme.colors.border,
            },
          ]}>
          {/* عنوان */}
          <GlobalText style={styles.title}>خروج از حساب</GlobalText>

          {/* متن */}
          <GlobalText style={styles.message}>
            آیا با خروج از حساب مطمئن هستید؟
            {'\n'}
            با خروج، اطلاعات ورود شما از دستگاه پاک می‌شود.
          </GlobalText>

          {/* دکمه‌ها */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel} style={styles.cancel}>
              <GlobalText>انصراف</GlobalText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={styles.confirm}
              disabled={loading}>
              <GlobalText style={{color: '#fff'}}>
                {loading ? 'در حال خروج...' : 'خروج'}
              </GlobalText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const getStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    box: {
      width: '85%',
      borderRadius: 16,
      borderWidth: 1,
      padding: 20,
    },
    title: {
      textAlign: 'right',
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    message: {
      textAlign: 'right',
      lineHeight: 24,
      marginBottom: 20,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancel: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    confirm: {
      backgroundColor: '#d9534f',
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 10,
    },
  });

export default ConfirmLogoutModal;
