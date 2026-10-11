import React from 'react';
import {
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useTheme} from '../context/MainContext';
import {useAuth} from '../context/AuthContext';
import {useImageContext} from '../context/ImageContext';
import {getUserAvatarSource} from '../utils/imageUtils';
import GlobalText from './GlobalText';
import ThemePicker from './ThemePicker';

const {width} = Dimensions.get('window');

interface SettingsOverlayProps {
  visible: boolean;
  onClose: () => void;
  overlayAnim: Animated.Value;
  panelWidth: number;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({
  visible,
  onClose,
  overlayAnim,
  panelWidth,
}) => {
  const {theme} = useTheme();
  const {user} = useAuth();
  const {mainImage} = useImageContext();

  // پنل از راست (پوزیشن panelWidth) به 0 می‌آید
  const panelTranslateX = overlayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [panelWidth, 0],
  });

  const avatarSource = getUserAvatarSource({
    avatarUrl: mainImage?.url,
    gender: user?.gender,
  });

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{translateX: panelTranslateX}],
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <GlobalText style={{fontSize: 24, color: theme.colors.text}}>
            ✕
          </GlobalText>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.userInfo}>
            <Animated.Image source={avatarSource} style={styles.avatar} />
            <GlobalText style={styles.userName}>
              {user?.nickname || 'کاربر'}
            </GlobalText>
            {user?.city && (
              <GlobalText style={styles.userCity}>{user.city}</GlobalText>
            )}
            <GlobalText style={styles.creditText}>
              اعتبار: {user?.credit || 0} سکه
            </GlobalText>
          </View>

          <ThemePicker />

          {/* سایر تنظیمات */}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%', // تمام عرض را می‌گیرد، اما فقط ۹۰٪ آن دیده می‌شود (به دلیل translateX)
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  scrollContent: {paddingBottom: 30},
  userInfo: {alignItems: 'center', marginBottom: 30},
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {fontSize: 20, fontWeight: 'bold'},
  userCity: {fontSize: 14, marginTop: 4},
  creditText: {fontSize: 14, marginTop: 4},
});

export default SettingsOverlay;
