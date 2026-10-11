import React from 'react';
import {Modal, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '../../context/MainContext';
import GlobalText from '../GlobalText';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmColor?: string;
}

const ConfirmModal: React.FC<Props> = ({
  visible,
  title,
  message,
  cancelText = 'لغو',
  confirmText = 'تأیید',
  onCancel,
  onConfirm,
  confirmColor,
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
          <GlobalText style={styles.title}>{title}</GlobalText>

          <GlobalText style={styles.message}>{message}</GlobalText>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onCancel} style={styles.cancel}>
              <GlobalText>{cancelText}</GlobalText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={styles.confirm}>
              <GlobalText>{confirmText}</GlobalText>
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
      backgroundColor: 'rgba(0,0,0,0.45)',
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
      fontWeight: 'bold',
      marginBottom: 12,
    },
    message: {
      textAlign: 'right',
      lineHeight: 24,
      marginBottom: 24,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cancel: {
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 10,
      backgroundColor: theme.colors.secondary,
    },
    confirm: {
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
    },
  });

export default ConfirmModal;
