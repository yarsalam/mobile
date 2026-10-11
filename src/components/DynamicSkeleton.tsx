import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '../context/MainContext';

type SkeletonType =
  | 'feed'
  | 'suggestions'
  | 'visitors'
  | 'newUsers'
  | 'profile';

interface DynamicSkeletonProps {
  type: SkeletonType;
  count?: number; // تعداد آیتم‌های اسکلتون
}
const {width: SCREEN_WIDTH} = Dimensions.get('window');
const AVATAR_SIZE = SCREEN_WIDTH * 0.32; // ۳۲٪ عرض صفحه

const DynamicSkeleton: React.FC<DynamicSkeletonProps> = ({type, count = 1}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const {theme} = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const shimmerStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: theme.colors.optionBackground,
    opacity: 0.3,
    transform: [{translateX: shimmerTranslateX}],
  };

  const renderFeedSkeleton = () => (
    <View style={styles.feedCard}>
      <View
        style={[
          styles.imagePlaceholder,
          {backgroundColor: theme.colors.border},
        ]}>
        <Animated.View style={shimmerStyle} />
      </View>
      <View style={styles.feedInfo}>
        <View
          style={[
            styles.textLine,
            {width: '60%', backgroundColor: theme.colors.border},
          ]}>
          <Animated.View style={shimmerStyle} />
        </View>
        <View
          style={[
            styles.textLine,
            {width: '40%', marginTop: 8, backgroundColor: theme.colors.border},
          ]}>
          <Animated.View style={shimmerStyle} />
        </View>
      </View>
    </View>
  );

  const renderSuggestionSkeleton = () => (
    <View style={styles.suggestionCard}>
      <View style={[styles.suggImage, {backgroundColor: theme.colors.border}]}>
        <Animated.View style={shimmerStyle} />
      </View>
      <View
        style={[
          styles.textLine,
          {width: '80%', marginTop: 8, backgroundColor: theme.colors.border},
        ]}>
        <Animated.View style={shimmerStyle} />
      </View>
    </View>
  );

  const renderVisitorSkeleton = () => (
    <View style={styles.visitorRow}>
      <View
        style={[styles.visitorAvatar, {backgroundColor: theme.colors.border}]}>
        <Animated.View style={shimmerStyle} />
      </View>
      <View style={{flex: 1, marginLeft: 10}}>
        <View
          style={[
            styles.textLine,
            {width: '50%', backgroundColor: theme.colors.border},
          ]}>
          <Animated.View style={shimmerStyle} />
        </View>
        <View
          style={[
            styles.textLine,
            {width: '30%', marginTop: 6, backgroundColor: theme.colors.border},
          ]}>
          <Animated.View style={shimmerStyle} />
        </View>
      </View>
    </View>
  );

  const renderNewUserSkeleton = () => (
    <View style={styles.newUserCircle}>
      <View style={[styles.circle, {backgroundColor: theme.colors.border}]}>
        <Animated.View style={shimmerStyle} />
      </View>
      <View
        style={[
          styles.textLine,
          {
            width: 50,
            marginTop: 6,
            alignSelf: 'center',
            backgroundColor: theme.colors.border,
          },
        ]}>
        <Animated.View style={shimmerStyle} />
      </View>
    </View>
  );

  const renderProfileSkeleton = () => (
    <View style={styles.profileContainer}>
      {/* آواتار گرد بزرگ */}
      <View style={styles.profileAvatar}>
        <View
          style={[styles.avatarCircle, {backgroundColor: theme.colors.border}]}>
          <Animated.View style={shimmerStyle} />
        </View>
      </View>

      {/* دکمه‌های اکشن (۴ دکمه) */}
      <View style={styles.profileActions}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={styles.actionButton}>
            <Animated.View style={[styles.square, shimmerStyle]} />
          </View>
        ))}
      </View>

      {/* نام کاربری */}
      <View style={styles.profileName}>
        <View
          style={[
            styles.textLine,
            {width: '40%', backgroundColor: theme.colors.border},
          ]}>
          <Animated.View style={shimmerStyle} />
        </View>
      </View>

      {/* لیست اطلاعات (شهر، استان، وضعیت تاهل، ...) - ۹ آیتم */}
      <View style={styles.profileInfoList}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={styles.infoRow}>
            <View
              style={[
                styles.textLine,
                {width: '30%', backgroundColor: theme.colors.border},
              ]}>
              <Animated.View style={shimmerStyle} />
            </View>
            <View
              style={[
                styles.textLine,
                {width: '50%', backgroundColor: theme.colors.border},
              ]}>
              <Animated.View style={shimmerStyle} />
            </View>
          </View>
        ))}
      </View>

      {/* بخش درباره من */}
      <View style={styles.aboutSection}>
        <View
          style={[
            styles.textLine,
            {width: '40%', backgroundColor: theme.colors.border},
          ]}>
          <Animated.View style={shimmerStyle} />
        </View>
        <View style={styles.aboutText}>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.textLine,
                {
                  width: '90%',
                  marginBottom: 8,
                  backgroundColor: theme.colors.border,
                },
              ]}>
              <Animated.View style={shimmerStyle} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (type) {
      case 'feed':
        return renderFeedSkeleton();
      case 'suggestions':
        return renderSuggestionSkeleton();
      case 'visitors':
        return renderVisitorSkeleton();
      case 'newUsers':
        return renderNewUserSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        type === 'suggestions' && styles.suggestionsRow,
        type === 'newUsers' && styles.newUsersRow,
      ]}>
      {Array.from({length: count}).map((_, i) => (
        <View key={i} style={type === 'feed' ? {marginRight: 10} : {margin: 5}}>
          {renderContent()}
        </View>
      ))}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
    },
    feedCard: {
      width: 285,
      height: 500,
      borderRadius: 15,
      backgroundColor: theme.colors.card,
      overflow: 'hidden',
    },
    imagePlaceholder: {
      width: 285,
      height: 250,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      overflow: 'hidden',
    },
    feedInfo: {
      padding: 15,
    },
    textLine: {
      height: 14,
      borderRadius: 7,
      overflow: 'hidden',
    },
    suggestionCard: {
      width: 130,
      height: 170,
      borderRadius: 15,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      padding: 12,
      overflow: 'hidden',
    },
    suggImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginBottom: 8,
      overflow: 'hidden',
    },
    visitorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.card,
      overflow: 'hidden',
    },
    visitorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      overflow: 'hidden',
    },
    newUserCircle: {
      alignItems: 'center',
      marginRight: 14,
      overflow: 'hidden',
    },
    circle: {
      width: 68,
      height: 68,
      borderRadius: 34,
      overflow: 'hidden',
    },
    suggestionsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    newUsersRow: {
      flexDirection: 'row',
    },
    profileContainer: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    profileAvatar: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
    avatarCircle: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      overflow: 'hidden',
    },
    profileActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginVertical: 20,
    },
    actionButton: {
      width: 45,
      height: 45,
      borderRadius: 30,
      overflow: 'hidden',
    },
    square: {
      width: '100%',
      height: '100%',
    },
    profileName: {
      alignItems: 'center',
      marginBottom: 20,
    },
    profileInfoList: {
      width: '100%',
      marginTop: 10,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    aboutSection: {
      width: '100%',
      marginTop: 20,
      alignItems: 'flex-start',
    },
    aboutText: {
      marginTop: 10,
      width: '100%',
    },
  });

export default DynamicSkeleton;
