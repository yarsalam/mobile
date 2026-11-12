import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlobalText from './GlobalText';
import {CARD_HEIGHT, CARD_WIDTH} from './user/UserCard';

interface PromotionData {
  variant: 'boost' | 'vip' | 'credit' | 'profile' | 'bundle' | string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaColor: string;
  gradientColors: string[];
}

interface PromotionCardProps {
  data: PromotionData;
  onPress: () => void;
  onDismiss: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  data,
  onPress,
  onDismiss,
}) => {
  const {variant, title, subtitle, ctaText, ctaColor, gradientColors} = data;

  const getIcon = () => {
    switch (variant) {
      case 'boost':
        return '🚀';
      case 'vip':
        return '👑';
      case 'credit':
        return '💰';
      default:
        return '✨';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="بستن پیشنهاد"
          onPress={onDismiss}
          hitSlop={10}
          style={styles.dismiss}>
          <GlobalText style={styles.dismissText}>×</GlobalText>
        </TouchableOpacity>
        <GlobalText style={styles.icon}>{getIcon()}</GlobalText>
        <GlobalText style={styles.title}>{title}</GlobalText>
        <GlobalText style={styles.subtitle}>{subtitle}</GlobalText>

        <TouchableOpacity
          onPress={onPress}
          accessibilityRole="button"
          style={[styles.cta, {backgroundColor: ctaColor}]}>
          <GlobalText style={styles.ctaText}>{ctaText}</GlobalText>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 8,
  },
  icon: {fontSize: 48, marginBottom: 16},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 24,
  },
  dismiss: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
    zIndex: 2,
  },
  dismissText: {color: '#fff', fontSize: 24, lineHeight: 26},
  cta: {paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25},
  ctaText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});

export default PromotionCard;
