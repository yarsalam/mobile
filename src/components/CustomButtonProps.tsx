import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlobalText from './GlobalText';
import {useTheme} from '../context/MainContext';

interface CustomButtonProps {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: boolean;
  loading?: boolean; // ← جدید
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  style,
  textStyle,
  gradient = false,
  loading = false,
  disabled = false,
}) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);

  const content = loading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <GlobalText
      numberOfLines={1}
      adjustsFontSizeToFit
      style={[styles.buttonText, textStyle]}>
      {label}
    </GlobalText>
  );

  return (
    <TouchableOpacity
      onPress={loading || disabled ? undefined : onPress}
      activeOpacity={0.8}
      style={[styles.confirmButton, style]}
      disabled={loading || disabled}>
      {gradient && (
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'transparent', 'rgba(0,0,0,0.13)']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.center}>{content}</View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    confirmButton: {
      backgroundColor: '#ff5bfa',
      padding: 13,
      borderRadius: 5,
      alignItems: 'center',
      width: '100%',
      borderWidth: 0.4,
      borderColor: '#c3c5c3ff',
      overflow: 'hidden',
      justifyContent: 'center',
      // minWidth: 48,
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontFamily: theme.fonts.primary,
      fontSize: 15,
      color: '#ffffff',
      fontWeight: 'bold',
    },
  });

export default CustomButton;
