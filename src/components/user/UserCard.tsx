import React, {useMemo} from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import GlobalText from '../GlobalText';
import LinearGradient from 'react-native-linear-gradient';
import {getAgeFromShamsiBirthYear} from '../../utils/getShamsiYear';
import {getUserAvatarSource} from '../../utils/imageUtils';
import {useTheme} from '../../context/MainContext';

interface User {
  id: number;
  nickname: string;
  gender: string;
  city?: string;
  age?: string;
  birth_day?: string;
  birth_month?: string;
  birth_year?: string;
  aboutme?: string;
  isFaceVerified?: string;
  hobbies_self?: string[];
  values_self?: string[];
  userImages?: {id: number; url: string; isMain: boolean}[];
}

interface UserCardProps {
  user: User;
  onProfilePress: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onPass: () => void;
  isFirst?: boolean;
  priority?: number;
  refLikeButton?: React.RefObject<any>;
  refPassButton?: React.RefObject<any>;
}

// ✅ ابعاد ثابت و همون کارت قبلی که کار می‌کرد
export const CARD_WIDTH = 285;
export const CARD_HEIGHT = 500;
const CARD_MARGIN = 12;
export const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;

const UserCard: React.FC<UserCardProps> = ({
  user,
  onProfilePress,
  onLike,
  onSuperLike,
  onPass,
  isFirst = false,
  priority,
  refLikeButton,
  refPassButton,
}) => {
  const age = user.age ?? getAgeFromShamsiBirthYear(user.birth_year);
  const mainImage =
    user.userImages?.find(img => img.isMain) || user.userImages?.[0];
  const imageUrl = mainImage?.url || null;
  const imageCount = user.userImages?.length || 0;

  const avatarSource = getUserAvatarSource({
    avatarUrl: imageUrl,
    gender: user?.gender,
  });
  const randomHobbies = useMemo(() => {
    if (!user.hobbies_self || user.hobbies_self.length === 0) return [];
    const shuffled = [...user.hobbies_self].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [user.hobbies_self]);
  const getBadge = (p?: number) => {
    if (!p) return null;
    if (p >= 100) return {icon: '⚡', text: 'Boost', color: '#FFD700'};
    if (p >= 80) return {icon: '👑', text: 'VIP', color: '#00FFAA'};
    if (p >= 60) return {icon: '💎', text: 'اعتبار', color: '#60A5FA'};
    return null;
  };

  const {theme} = useTheme();
  const styles = getStyles(theme);
  const badge = getBadge(priority);
  console.log('user', user);
  return (
    <View style={[styles.card, {marginHorizontal: CARD_MARGIN}]}>
      <LinearGradient
        colors={theme.colors.userCardGradient}
        style={[StyleSheet.absoluteFill, {borderRadius: 15}]}
      />

      {badge && (
        <View style={[styles.badgeContainer, {backgroundColor: badge.color}]}>
          <GlobalText style={styles.badgeText}>
            {badge.icon} {badge.text}
          </GlobalText>
        </View>
      )}
      {/* عکس با کلیک پروفایل */}
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.9}>
        <Image source={avatarSource} style={styles.avatar} />
        {imageCount > 1 && (
          <View style={styles.imageCounter}>
            <GlobalText style={styles.imageCounterText}>
              📸 {imageCount}
            </GlobalText>
          </View>
        )}
        {isFirst && (
          <View style={styles.firstBadge}>
            <GlobalText style={styles.firstBadgeText}>🔥 جدید</GlobalText>
          </View>
        )}
      </TouchableOpacity>

      {/* نام + سن + شهر */}
      <View style={styles.infoRow}>
        {user.isFaceVerified && (
          <GlobalText style={{color: '#4CAF50', marginLeft: 4}}>✓</GlobalText>
        )}
        {user.city && (
          <GlobalText style={styles.text}>- {user.city}</GlobalText>
        )}
        {age && <GlobalText style={styles.text}>{age} ساله</GlobalText>}
        <GlobalText style={styles.text}>{user.nickname}</GlobalText>
      </View>

      {/* ارزش‌ها */}
      {user.values_self && user.values_self.length > 0 && (
        <View style={styles.tagsRow}>
          {user.values_self.slice(0, 3).map((val, i) => (
            <View key={`value-${i}`} style={styles.valTag}>
              <GlobalText style={styles.tagText}>{val}</GlobalText>
            </View>
          ))}
        </View>
      )}

      {/* هابیز */}
      {randomHobbies.length > 0 && (
        <View style={styles.tagsRow}>
          {randomHobbies.map((tag, i) => (
            <View key={`hobby-${i}`} style={styles.hobTag}>
              <GlobalText style={styles.tagText}>{tag}</GlobalText>
            </View>
          ))}
        </View>
      )}

      {/* دکمه‌ها */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          ref={refPassButton}
          onPress={onPass}
          style={[styles.btn, {borderColor: '#FF4C4C'}]}>
          <GlobalText style={styles.btnText}>❌</GlobalText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSuperLike}
          style={[styles.btn, {borderColor: '#3eb2f0'}]}>
          <GlobalText style={styles.btnText}>⭐</GlobalText>
        </TouchableOpacity>

        <TouchableOpacity
          ref={refLikeButton}
          onPress={onLike}
          style={[styles.btn, {borderColor: '#51efb7'}]}>
          <GlobalText style={styles.btnText}>❤️</GlobalText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onProfilePress}
          style={[styles.btn, {borderColor: '#fdd835'}]}>
          <GlobalText style={styles.btnText}>👤</GlobalText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    badgeContainer: {
      position: 'absolute',
      top: 10,
      left: 10,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 12,
      zIndex: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    badgeText: {
      color: '#000',
      fontSize: 12,
      fontWeight: 'bold',
    },
    card: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#1a1a1a',
      overflow: 'hidden',
    },
    avatar: {
      width: 265,
      height: 250,
      borderRadius: 12,
      borderWidth: 1.2,
      borderColor: '#efefef',
    },
    imageCounter: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 15,
    },
    imageCounterText: {
      color: '#fff',
      fontSize: 12,
    },
    firstBadge: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: '#FF4C4C',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    firstBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    infoRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignSelf: 'flex-end',
      marginTop: 10,
    },
    text: {
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 3,
      color: theme.colors.text,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      alignSelf: 'flex-end',
      marginTop: 8,
    },
    hobTag: {
      backgroundColor: '#5f5e61ff',
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: '#ffffffff',
      paddingVertical: 5,
      paddingHorizontal: 10,
      margin: 3,
    },
    valTag: {
      backgroundColor: '#42393a',
      borderRadius: 12,
      borderWidth: 0.5,
      borderColor: '#8f8f8fff',
      paddingVertical: 5,
      paddingHorizontal: 10,
      margin: 3,
    },
    tagText: {
      fontSize: 13,
      color: '#fff',
    },
    actionsRow: {
      position: 'absolute',
      bottom: 18,
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      paddingHorizontal: 10,
    },
    btn: {
      width: 45,
      height: 45,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0d0407',
      borderWidth: 1,
    },
    btnText: {
      fontSize: 20,
      color: '#fff',
    },
  });

export default UserCard;
