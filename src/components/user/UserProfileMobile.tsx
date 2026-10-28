import React, {useMemo, useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useImageContext} from '../../context/ImageContext';
import {useTheme} from '../../context/MainContext';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

import GlobalText from '../GlobalText';
import ImageSlider from '../image/ImageSlider';
import EmptyState from '../EmptyState';
import {getUserAvatarSource} from '../../utils/imageUtils';
import {useToast} from '../../context/ToastContext';
import {RootStackParamList} from '../../../types/rootStackParamList';

import {useLikeMutation} from '../../api/intractions/mutations/useLikeMutation';
import {useReportMutation} from '../../api/intractions/mutations/useReportMutation';
import {useBlockMutation} from '../../api/intractions/mutations/useBlockMutation';
import {useUnBlockMutation} from '../../api/intractions/mutations/useUnBlockMutation';
import {useRelationStatus} from '../../api/mutations/relations';
import {API_BASE_URL} from '../../config/api';
import {useRecordVisit} from '../../api/mutations/visitors/useRecordVisit';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const AVATAR_SIZE = SCREEN_WIDTH * 0.32;
const BORDER_WIDTH = AVATAR_SIZE + 10;

const icons = {
  like: require('../../assets/img/like.png'),
  editImg: require('../../assets/img/editImg.png'),
  editProfile: require('../../assets/img/editProfile.png'),
  blockUser: require('../../assets/img/blockUser.png'),
  unblockUser: require('../../assets/img/unblockUser.png'),
  reportUser: require('../../assets/img/reportUser.png'),
  sendMessage: require('../../assets/img/sendMessage.png'),
};

// ─── زیرکامپوننت‌های کوچک ────────────────────────────────────────────────────

const OnlineBadge = ({
  isOnline,
  pulseAnim,
}: {
  isOnline: boolean;
  pulseAnim: Animated.Value;
}) => (
  <View
    style={[badge.dot, {backgroundColor: isOnline ? '#10B981' : '#EF4444'}]}>
    {isOnline && (
      <Animated.View
        style={[
          badge.pulse,
          {
            transform: [{scale: pulseAnim}],
            opacity: pulseAnim.interpolate({
              inputRange: [1, 1.2],
              outputRange: [0.6, 0],
            }),
          },
        ]}
      />
    )}
  </View>
);

const badge = StyleSheet.create({
  dot: {
    position: 'absolute',
    bottom: AVATAR_SIZE * 0.14,
    right: AVATAR_SIZE * 0.044,
    width: 19,
    height: 19,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  pulse: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
  },
});

const MembershipBadge = ({
  tier,
  isOwnProfile,
  onUpgrade,
}: {
  tier: string;
  isOwnProfile: boolean;
  onUpgrade: () => void;
}) => {
  const icons: Record<string, string> = {premium: '⭐', vip: '👑', gold: '🥇'};
  const isPaid = tier !== 'free';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}>
      {isPaid ? (
        <>
          <GlobalText style={{fontSize: 20}}>{icons[tier]}</GlobalText>
          <GlobalText style={{fontSize: 14, opacity: 0.8}}>ویژه</GlobalText>
        </>
      ) : (
        <>
          {isOwnProfile && (
            <TouchableOpacity onPress={onUpgrade}>
              <GlobalText
                style={{fontSize: 14, textDecorationLine: 'underline'}}>
                خرید عضویت
              </GlobalText>
            </TouchableOpacity>
          )}
          <GlobalText style={{fontSize: 14, opacity: 0.8}}>
            وضعیت کاربر: عادی
          </GlobalText>
        </>
      )}
    </View>
  );
};

// ─── کامپوننت اصلی ───────────────────────────────────────────────────────────

const UserProfileMobile = ({user: passedUser}: {user?: any}) => {
  const {user: authUser} = useAuth();
  const user = passedUser || authUser;
  const isOwnProfile = !passedUser;

  const {images} = useImageContext();
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {showToast} = useToast();
  const insets = useSafeAreaInsets();

  // ─── state ────────────────────────────────────────────────────────────────
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ─── mutations ────────────────────────────────────────────────────────────
  const recordVisit = useRecordVisit();
  const likeMutation = useLikeMutation();
  const reportMutation = useReportMutation();
  const blockMutation = useBlockMutation();
  const unBlockMutation = useUnBlockMutation();
  const {data: relation} = useRelationStatus(user?.id);
  const isBlockedByMe = relation?.blockedByMe;

  // ─── ثبت بازدید ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOwnProfile && user?.id) {
      recordVisit.mutate(user.id);
    }
    // فقط یک‌بار هنگام mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ─── آنلاین ───────────────────────────────────────────────────────────────
  const isOnline = user?.lastActive
    ? Date.now() - new Date(user.lastActive).getTime() < 5 * 60 * 1000
    : false;

  useEffect(() => {
    if (!isOnline) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isOnline, pulseAnim]);

  // ─── تصاویر ───────────────────────────────────────────────────────────────
  const rawImages = passedUser ? passedUser.userImages || [] : images;
  const fullImages = useMemo(
    () =>
      rawImages.map((img: any) => ({
        ...img,
        url: img.url?.startsWith('http')
          ? img.url
          : `${API_BASE_URL}${img.url}?t=${Date.now()}`,
      })),
    [rawImages],
  );

  const avatarUrl =
    user?.userImages?.find((img: any) => img.isMain)?.url ||
    user?.userImages?.[0]?.url;
  const avatarSource = getUserAvatarSource({avatarUrl, gender: user?.gender});

  // ─── ردیف‌های اطلاعات ─────────────────────────────────────────────────────
  const profileRows = [
    {label: 'شهر', value: user?.city},
    {label: 'استان', value: user?.province},
    {label: 'وضعیت تأهل', value: user?.marital},
    {label: 'تحصیلات', value: user?.education},
    {label: 'شغل', value: user?.employment},
    {label: 'قد', value: user?.height ? `${user.height} سانتی‌متر` : ''},
    {label: 'وزن', value: user?.weight ? `${user.weight} کیلوگرم` : ''},
    {label: 'ملیت', value: user?.nationality},
    {label: 'دین', value: user?.religion},
  ].filter(r => r.value);

  const aboutRows = [
    {label: 'درباره من', value: user?.aboutme},
    {label: 'درباره همسر ایده‌آل', value: user?.partner_about},
  ].filter(r => r.value);

  // ─── هندلرها ──────────────────────────────────────────────────────────────
  const handleLike = () => likeMutation.mutate(user.id);
  const handleBlock = () =>
    blockMutation.mutate({userId: authUser!.id, targetId: user.id});
  const handleUnBlock = () =>
    unBlockMutation.mutate({userId: authUser!.id, targetId: user.id});
  const handleMessage = () =>
    navigation.navigate('Chat', {userId: user.id, nickname: user.nickname});
  const handleReport = () =>
    reportMutation.mutate({
      reporterId: authUser!.id,
      reportedUserId: user.id,
      reason: 'spam',
    });
  const handleOpenImages = () => {
    if (fullImages.length > 0) {
      setActiveImageIndex(0);
      setIsSliderOpen(true);
    } else showToast('این کاربر فقط یک عکس دارد', 'info');
  };

  // ─── محاسبات layout ───────────────────────────────────────────────────────
  const headerTop = -AVATAR_SIZE / 1.1;
  const avatarBottom = headerTop + BORDER_WIDTH;

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.outerContainer}>
      {/* آواتار */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={[styles.avatarContainer, {marginTop: headerTop}]}>
          <TouchableOpacity onPress={handleOpenImages} activeOpacity={0.8}>
            <LinearGradient
              colors={['#F58529', '#DD2A7B', '#8134AF']}
              style={{
                width: BORDER_WIDTH,
                height: BORDER_WIDTH,
                borderRadius: BORDER_WIDTH / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={avatarSource}
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE / 2,
                }}
              />
            </LinearGradient>
          </TouchableOpacity>

          {user?.isFaceVerified && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
              }}>
              <GlobalText style={{color: '#4CAF50', fontSize: 18}}>
                ✓
              </GlobalText>
              <GlobalText
                style={{color: '#4CAF50', fontSize: 14, marginLeft: 4}}>
                کاربر تأیید شده
              </GlobalText>
            </View>
          )}

          <OnlineBadge isOnline={isOnline} pulseAnim={pulseAnim} />

          {rawImages.length > 1 && (
            <View style={styles.photoCountBadge}>
              <GlobalText style={styles.photoCountText}>
                📷 {rawImages.length}
              </GlobalText>
            </View>
          )}
        </View>
      </View>

      {/* نوار اکشن */}
      <View style={[styles.actionBar, {marginTop: avatarBottom + 1}]}>
        {isOwnProfile ? (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditImg' as never)}>
              <View style={{position: 'relative'}}>
                <Image source={icons.editImg} style={styles.actionIcon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditUserProfile' as never)}>
              <View style={{position: 'relative'}}>
                <Image source={icons.editProfile} style={styles.actionIcon} />
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {isBlockedByMe ? (
              <TouchableOpacity
                onPress={handleUnBlock}
                style={styles.actionBtn}>
                <GlobalText style={styles.actionIcon}>🔓</GlobalText>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleBlock}
                  style={styles.actionBtn}>
                  <View style={{position: 'relative'}}>
                    <Image source={icons.blockUser} style={styles.actionIcon} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
                  <View style={{position: 'relative'}}>
                    <Image source={icons.like} style={styles.actionIcon} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleMessage}
                  style={styles.actionBtn}>
                  <View style={{position: 'relative'}}>
                    <Image
                      source={icons.sendMessage}
                      style={styles.actionIcon}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReport}
                  style={styles.actionBtn}>
                  <View style={{position: 'relative'}}>
                    <Image
                      source={icons.reportUser}
                      style={styles.actionIcon}
                    />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>

      {/* محتوا */}
      <View style={[styles.root, {backgroundColor: theme.colors.background}]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{paddingBottom: 20}}
          showsVerticalScrollIndicator={false}>
          {isBlockedByMe ? (
            <View style={{paddingVertical: 100, alignItems: 'center'}}>
              <EmptyState icon="🚫" title="این کاربر بلاک شده است" />
            </View>
          ) : (
            <>
              {/* نام و عضویت */}
              <View style={styles.nameSection}>
                <GlobalText style={styles.nickname}>
                  {user?.nickname || 'کاربر'}
                </GlobalText>
                <MembershipBadge
                  tier={user?.tier || 'free'}
                  isOwnProfile={isOwnProfile}
                  onUpgrade={() => navigation.navigate('Products')}
                />
              </View>

              {/* اطلاعات */}
              {profileRows.length > 0 && (
                <View style={styles.infoBox}>
                  {profileRows.map((row, idx) => (
                    <View key={idx} style={styles.infoRow}>
                      <GlobalText style={styles.infoLabel}>
                        {row.label}:
                      </GlobalText>
                      <GlobalText style={styles.infoValue}>
                        {row.value}
                      </GlobalText>
                    </View>
                  ))}
                </View>
              )}

              {/* درباره */}
              {aboutRows.map((row, idx) => (
                <View key={idx} style={styles.aboutBlock}>
                  <GlobalText style={styles.sectionTitle}>
                    {row.label}
                  </GlobalText>
                  <GlobalText style={styles.aboutText}>{row.value}</GlobalText>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>

      {!isBlockedByMe && (
        <ImageSlider
          visible={isSliderOpen}
          images={fullImages}
          initialIndex={activeImageIndex}
          onClose={() => setIsSliderOpen(false)}
        />
      )}
    </View>
  );
};

// ─── استایل‌ها ────────────────────────────────────────────────────────────────
const getStyles = (theme: any) =>
  StyleSheet.create({
    outerContainer: {flex: 1, marginTop: AVATAR_SIZE / 1.5},
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      alignItems: 'flex-start',
    },
    avatarContainer: {
      alignSelf: 'flex-start',
      marginLeft: 20,
      position: 'relative',
      top: AVATAR_SIZE / 2.9,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 5},
      shadowOpacity: 0.6,
      shadowRadius: 3,
      elevation: 10,
    },
    photoCountBadge: {
      position: 'absolute',
      bottom: AVATAR_SIZE * 0.05,
      left: AVATAR_SIZE * 0.05,
    },
    photoCountText: {color: '#fff', fontSize: 30, fontWeight: 'bold'},
    actionBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 12,
      bottom: AVATAR_SIZE,
    },
    actionBtn: {},
    actionIcon: {
      width: 40,
      height: 40,
      tintColor: '#ff0000',
      marginVertical: 20,
    },
    root: {
      borderRadius: 10,
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
      bottom: AVATAR_SIZE / 4.2,
    },
    scroll: {flex: 1},
    nameSection: {
      alignItems: 'center',
      marginTop: AVATAR_SIZE / 1.8,
      marginBottom: 12,
    },
    nickname: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 6,
    },
    infoBox: {
      padding: 12,
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 10,
    },
    infoRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {fontSize: 14, color: theme.colors.text},
    infoValue: {
      fontSize: 14,
      color: theme.colors.text,
      flex: 1,
      textAlign: 'left',
      marginLeft: 20,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      marginHorizontal: 10,
      textAlign: 'right',
    },
    aboutBlock: {marginBottom: 16, marginHorizontal: 10},
    aboutText: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 22,
      textAlign: 'right',
    },
  });

export default UserProfileMobile;
