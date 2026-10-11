import React from 'react';
import {TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlobalText from './GlobalText';
import {CARD_HEIGHT, CARD_WIDTH} from './user/UserCard';

const {width} = Dimensions.get('window');

const PromotionCard = ({data, onPress}) => {
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
        <GlobalText style={styles.icon}>{getIcon()}</GlobalText>
        <GlobalText style={styles.title}>{title}</GlobalText>
        <GlobalText style={styles.subtitle}>{subtitle}</GlobalText>

        <TouchableOpacity style={[styles.cta, {backgroundColor: ctaColor}]}>
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
  cta: {paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25},
  ctaText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});

export default PromotionCard;
