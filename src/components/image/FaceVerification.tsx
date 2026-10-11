import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import GlobalText from '../GlobalText';
import {useRequestVerification} from '../../api/mutations/verification/useVerification';
import {useTheme} from '../../context/MainContext';

const FaceVerification = () => {
  const {mutate, isPending} = useRequestVerification();
  const [modalVisible, setModalVisible] = useState(false);
  const {theme} = useTheme();
  const styles = getStyles(theme);

  const handleOpenCamera = () => {
    setModalVisible(false);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      },
      response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (asset?.uri) {
          mutate({
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            name: asset.fileName || 'selfie.jpg',
          });
        }
      },
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        disabled={isPending}>
        <GlobalText style={styles.buttonText}>
          {isPending ? 'در حال ارسال...' : 'تأیید چهره'}
        </GlobalText>
      </TouchableOpacity>

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
            <GlobalText style={styles.modalTitle}>تأیید چهره</GlobalText>
            <GlobalText style={styles.modalMessage}>
              برای تأیید هویت، یک عکس سلفی از چهرهٔ خود بگیرید. این عکس با عکس
              اصلی پروفایل شما مقایسه خواهد شد.
            </GlobalText>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <GlobalText style={styles.cancelText}>انصراف</GlobalText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleOpenCamera}>
                <GlobalText style={styles.confirmText}>
                  باز کردن دوربین
                </GlobalText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    button: {
      backgroundColor: '#4CAF50',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '85%',
      borderRadius: 5,
      padding: 20,
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
      borderWidth: 0.7,
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
    cancelButton: {
      backgroundColor: '#ccc',
    },
    confirmButton: {
      backgroundColor: '#4CAF50',
    },
    cancelText: {
      color: '#333',
      fontWeight: 'bold',
    },
    confirmText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

export default FaceVerification;
