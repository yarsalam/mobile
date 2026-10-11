import React, {useState} from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import GlobalText from '../GlobalText';
import {useTheme} from '../../context/MainContext';
import EmptyState from '../EmptyState';
import CustomButton from '../CustomButtonProps';
import {getUserAvatarSource} from '../../utils/imageUtils';
import LoadingWrapper from '../LoadingWrapper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';

export interface Visitor {
  id: number;
  name: string;
  avatarUrl: string | null;
  time: string;
  visitCount: number; // ← تعداد بازدید از DB
  checked?: boolean; // ← آیا صاحب پروفایل دیده
  gender?: string;
}

interface VisitorsListProps {
  title?: string;
  data?: Visitor[];
  isLoading: boolean;
  onVisitorPress?: (id: number) => void;
}

const PAGE_SIZE = 5;

const VisitorsList: React.FC<VisitorsListProps> = ({
  title,
  data = [],
  isLoading,
  onVisitorPress,
}) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const visibleData = data.slice(0, visibleCount);
  const showMore = visibleCount < data.length;
  const showLess = visibleCount > PAGE_SIZE;

  const emptyComponent = (
    <View style={{marginTop: 5, alignItems: 'center'}}>
      <EmptyState
        icon="👀"
        title={title}
        description="هنوز موردی برای نمایش وجود ندارد."
        highlight="هنوز کسی پروفایل شما را ندیده است."
        actionText="برو پروفایل‌ها رو ببین و تعاملت رو زیاد کن"
        onAction={() => navigation.navigate('Search')}
      />
    </View>
  );

  const renderItem = ({item}: {item: Visitor}) => {
    const avatarSource = getUserAvatarSource({
      avatarUrl: item.avatarUrl,
      gender: item.gender,
    });

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          onVisitorPress?.(item.id);
          navigation.navigate('UserProfile', {user: item.id});
        }}
        style={[styles.card, item.checked && styles.cardRead]}>
        {/* آواتار + badge تعداد */}
        <View style={styles.avatarWrapper}>
          <Image source={avatarSource} style={styles.avatar} />
          {item.visitCount > 1 && (
            <View style={styles.countBadge}>
              <GlobalText style={styles.countText}>
                {item.visitCount}×
              </GlobalText>
            </View>
          )}
        </View>

        {/* اطلاعات */}
        <View style={styles.info}>
          <GlobalText style={styles.name}>{item.name}</GlobalText>
          <GlobalText style={styles.time}>{item.time}</GlobalText>
        </View>

        {/* نقطه خوانده‌نشده */}
        {!item.checked && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      {title && <GlobalText style={styles.title}>{title}</GlobalText>}
      <LoadingWrapper
        isLoading={isLoading}
        hasData={data.length > 0}
        skeletonType="visitors"
        skeletonCount={2}
        emptyComponent={emptyComponent}>
        <FlatList
          data={visibleData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
        <View style={styles.buttonsRow}>
          {showMore && (
            <CustomButton
              onPress={() => setVisibleCount(c => c + PAGE_SIZE)}
              label="بیشتر ▼"
              style={{width: '30%', padding: 10}}
              gradient
            />
          )}
          {showLess && (
            <CustomButton
              onPress={() => setVisibleCount(PAGE_SIZE)}
              label="کمتر ▲"
              style={{width: '30%', padding: 10}}
              gradient
            />
          )}
        </View>
      </LoadingWrapper>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: 20,
      borderWidth: 0.2,
      padding: 10,
      borderColor: theme.colors.border,
      borderRadius: 5,
    },
    title: {
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'right',
    },
    card: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      padding: 12,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      borderWidth: 0.8,
      borderColor: theme.colors.border,
    },
    cardRead: {
      opacity: 0.5, // ← خوانده‌شده کمرنگ‌تر
    },
    avatarWrapper: {
      position: 'relative',
      marginLeft: 10,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    countBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      backgroundColor: '#FF4C4C',
      borderRadius: 10,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderWidth: 1.5,
      borderColor: theme.colors.background,
      minWidth: 20,
      alignItems: 'center',
    },
    countText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'right',
    },
    time: {
      fontSize: 12,
      color: theme.colors.text,
      textAlign: 'right',
      marginTop: 3,
      opacity: 0.7,
    },
    unreadDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#FF4C4C',
      alignSelf: 'center',
      marginLeft: 6,
    },
    buttonsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: 12,
    },
  });

export default VisitorsList;
