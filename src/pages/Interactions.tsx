import React, {useCallback} from 'react';
import {
  FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, View, Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MainLayout from '../theme/MainLayout';
import GlobalText from '../components/GlobalText';
import {useTheme} from '../context/MainContext';
import {useNavigation} from '@react-navigation/native';
import {
  useInteractions,
  useMarkAsRead,
  useMarkInteractionsRead,
} from '../api/mutations/notifications/useNotifications';

const TYPE_CONFIG: Record<string, {icon: string; color: string; label: string}> = {
  like:      {icon: '❤️', color: '#ff4d6d', label: 'لایک'},
  superlike: {icon: '⭐', color: '#f4a261', label: 'سوپرلایک'},
  match:     {icon: '🎉', color: '#52b788', label: 'مچ'},
  visitor:   {icon: '👀', color: '#4895ef', label: 'بازدید'},
};

const Interactions = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {data: interactions = [], isLoading, refetch} = useInteractions();
  const markAsRead = useMarkAsRead();
  const markAllRead = useMarkInteractionsRead();

  // وقتی صفحه focus میشه badge رو reset کن
  useFocusEffect(
    useCallback(() => {
      markAllRead.mutate();
    }, []),
  );

  const handlePress = (item: any) => {
    markAsRead.mutate(item.id);
    if (item.related_id) {
      navigation.navigate('UserProfile' as never, {user: item.related_id} as never);
    }
  };

  const renderItem = ({item}: any) => {
    const config = TYPE_CONFIG[item.type] || {icon: '📢', color: '#888', label: ''};
    const date = new Date(item.created_at);
    const timeStr = date.toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'});
    const dateStr = date.toLocaleDateString('fa-IR');

    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
        style={[
          styles.card,
          {backgroundColor: theme.colors.card},
          !item.is_read && styles.unreadCard,
        ]}>
        {/* نوار رنگی سمت راست */}
        <View style={[styles.colorBar, {backgroundColor: config.color}]} />

        {/* آیکون */}
        <View style={[styles.iconWrap, {backgroundColor: config.color + '20'}]}>
          <GlobalText style={styles.icon}>{config.icon}</GlobalText>
        </View>

        {/* محتوا */}
        <View style={styles.content}>
          <GlobalText style={[styles.message, {color: theme.colors.text}]}>
            {item.message}
          </GlobalText>
          <View style={styles.meta}>
            <GlobalText style={styles.label}>{config.label}</GlobalText>
            <GlobalText style={styles.time}>{timeStr} · {dateStr}</GlobalText>
          </View>
        </View>

        {/* dot خوانده‌نشده */}
        {!item.is_read && (
          <View style={[styles.dot, {backgroundColor: config.color}]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <GlobalText style={[styles.title, {color: theme.colors.text}]}>
          تعاملات
        </GlobalText>
        <GlobalText style={styles.subtitle}>
          {interactions.length} مورد
        </GlobalText>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{marginTop: 40}} color={theme.colors.secondary} />
      ) : interactions.length === 0 ? (
        <View style={styles.empty}>
          <GlobalText style={styles.emptyIcon}>💫</GlobalText>
          <GlobalText style={[styles.emptyText, {color: theme.colors.text}]}>
            هنوز تعاملی دریافت نکرده‌اید
          </GlobalText>
          <GlobalText style={styles.emptyHint}>
            وقتی کسی پروفایل شما را ببیند یا لایک کند اینجا نمایش داده می‌شود
          </GlobalText>
        </View>
      ) : (
        <FlatList
          data={interactions}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{padding: 16, gap: 10}}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: {fontSize: 18, fontWeight: 'bold'},
  subtitle: {fontSize: 13, color: '#888'},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  unreadCard: {elevation: 3},
  colorBar: {width: 4, alignSelf: 'stretch'},
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {fontSize: 22},
  content: {flex: 1, paddingVertical: 14, paddingRight: 8},
  message: {fontSize: 14, lineHeight: 22, textAlign: 'right'},
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  label: {fontSize: 11, color: '#888'},
  time: {fontSize: 11, color: '#aaa'},
  dot: {
    width: 8, height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  empty: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', padding: 40,
  },
  emptyIcon: {fontSize: 48, marginBottom: 16},
  emptyText: {fontSize: 16, fontWeight: 'bold', marginBottom: 8},
  emptyHint: {fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 22},
});

export default Interactions;