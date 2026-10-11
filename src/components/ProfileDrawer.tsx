import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GlobalText from './GlobalText';
import {useAuth} from '../context/AuthContext';
import {useTheme} from '../context/MainContext';
import ConfirmLogoutModal from './user/ConfirmLogoutModal';

const {width} = Dimensions.get('window');

interface ProfileDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({isVisible, onClose}) => {
  const navigation = useNavigation();
  const translateX = useRef(new Animated.Value(width)).current;
  const {logout} = useAuth();
  const {theme} = useTheme();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : width,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible, translateX]);

  const menuItems = [
    {title: 'پروفایل کاربری', screen: 'UserProfile'},
    {title: 'ویرایش پروفایل', screen: 'EditUserProfile'},
    {title: 'ویرایش موبایل', screen: 'ChangeUserMobile'},
    {title: 'ویرایش رمز عبور', screen: 'ChangeUserPassword'},
    {title: 'ویرایش عکس', screen: 'EditImg'},
    {title: 'تأیید هویت', screen: 'FaceVerification'},
    {title: 'خروج', screen: 'Logout'},
  ];

  return (
    <>
      <Modal transparent visible={isVisible} animationType="none">
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={onClose}
          />

          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{translateX}],
                backgroundColor: theme.colors.background + 'cc',
                borderColor: theme.colors.border,
              },
            ]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <GlobalText style={styles.closeText}>✖</GlobalText>
            </TouchableOpacity>

            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.screen === 'Logout') {
                    setShowLogoutModal(true);
                  } else {
                    navigation.navigate(item.screen as never);
                    onClose();
                  }
                }}>
                <GlobalText style={styles.menuText}>{item.title}</GlobalText>
                <Image
                  source={require('../assets/img/back.png')}
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            ))}
          </Animated.View>
        </View>
      </Modal>

      {/* 🔴 Confirm Logout Modal */}
      <ConfirmLogoutModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          await logout();
          setShowLogoutModal(false);
          onClose();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  overlayBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  drawer: {
    width: '75%',
    height: '85%',
    borderRadius: 10,
    borderWidth: 1,
    padding: 20,
    alignItems: 'flex-start',
    position: 'absolute',
    top: 127,
    right: 0,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  arrowIcon: {
    width: 20,
    height: 10,
    position: 'absolute',
    left: 0,
    top: 22,
  },
});

export default ProfileDrawer;
