import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import GlobalText from './GlobalText';
import { useTheme } from '../context/MainContext';
import { getAgeFromShamsiBirthYear } from '../utils/getShamsiYear';
import { getUserAvatarSource } from '../utils/imageUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HorizontalUserCardProps {
  user: any;
  onPress: () => void;
}

const PLACEHOLDER_AVATAR = require('../assets/img/man_avt.png');

const HorizontalUserCard: React.FC<HorizontalUserCardProps> = ({ user, onPress }) => {
  const { theme } = useTheme();

  // اگر user وجود نداشت، یک شیء خالی در نظر بگیر
  const safeUser = user || {};
  const age = safeUser.birth_year ? getAgeFromShamsiBirthYear(safeUser.birth_year) : null;
  const mainImage = safeUser.userImages?.find((img: any) => img.isMain) || safeUser.userImages?.[0];
  const avatarSource = mainImage?.url
    ? getUserAvatarSource({ avatarUrl: mainImage.url, gender: safeUser.gender })
    : PLACEHOLDER_AVATAR;

  // اگر حتی safeUser هم بی‌مقدار باشد، نام پیش‌فرض نمایش بده
  const nickname = safeUser.nickname || 'کاربر';
  const city = safeUser.city || '';
  const education = safeUser.education || '';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      activeOpacity={0.8}
    >
      <Image source={avatarSource} style={styles.image} />
      <View style={styles.infoContainer}>
        <GlobalText style={styles.name}>{nickname}</GlobalText>
        {age && <GlobalText style={styles.detail}>{age} ساله</GlobalText>}
        {city ? <GlobalText style={styles.detail}>{city}</GlobalText> : null}
        {education ? <GlobalText style={styles.detail}>{education}</GlobalText> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
    height: 140,
  },
  image: {
    width: SCREEN_WIDTH * 0.35,
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default HorizontalUserCard;