import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlobalText from './GlobalText';
import {CARD_HEIGHT, CARD_WIDTH} from './user/UserCard';

interface PromotionData {
  variant: 'boost' | 'vip' | 'credit' | string;
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

const PromotionCard: React.FC<PromotionCardProps> = ({data, onPress, onDismiss}) => {
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
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={ctaText}>
        <LinearGradient
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.card}>
          <GlobalText style={styles.icon}>{getIcon()}</GlobalText>
          <GlobalText style={styles.title}>{title}</GlobalText>
          <GlobalText style={styles.subtitle}>{subtitle}</GlobalText>
          <View style={[styles.cta, {backgroundColor: ctaColor}]}>
            <GlobalText style={styles.ctaText}>{ctaText}</GlobalText>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dismiss}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="بستن پیشنهاد"
        hitSlop={8}>
        <GlobalText style={styles.dismissText}>×</GlobalText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 8,
  },
  dismiss: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.38)',
    zIndex: 2,
  },
  dismissText: {color: '#fff', fontSize: 24, lineHeight: 26},
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  cta: {paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25},
  ctaText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});

export default PromotionCard;
