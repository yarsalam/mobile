import React, {useCallback} from 'react';
import {
  FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MainLayout from '../theme/MainLayout';
import GlobalText from '../components/GlobalText';
import {useTheme} from '../context/MainContext';
import {
  useSystemNotifications,
  useMarkSystemRead,
} from '../api/mutations/notifications/useNotifications';

const TYPE_CONFIG: Record<string, {icon: string; color: string; label: string}> = {
  system:       {icon: '📢', color: '#6c757d', label: 'سیستم'},
  payment:      {icon: '💳', color: '#2196f3', label: 'پرداخت'},
  vip:          {icon: '👑', color: '#f4a261', label: 'VIP'},
  verification: {icon: '✅', color: '#52b788', label: 'تأیید هویت'},
  ticket:       {icon: '🎫', color: '#9c6644', label: 'تیکت'},
  security:     {icon: '🔒', color: '#e63946', label: 'امنیت'},
};

const NotificationsScreen = () => {
  const {theme} = useTheme();
  const {data: notifications = [], isLoading, isError, refetch} = useSystemNotifications();
  const markAllRead = useMarkSystemRead();

  useFocusEffect(
    useCallback(() => {
      markAllRead.mutate();
    }, []),
  );

  const renderItem = ({item}: any) => {
    const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.system;
    const date = new Date(item.created_at);
    const timeStr = date.toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit'});
    const dateStr = date.toLocaleDateString('fa-IR');

    return (
      <View
        style={[
          styles.card,
          {backgroundColor: theme.colors.card},
          !item.is_read && styles.unreadCard,
        ]}>
        <View style={[styles.colorBar, {backgroundColor: config.color}]} />
        <View style={[styles.iconWrap, {backgroundColor: config.color + '20'}]}>
          <GlobalText style={styles.icon}>{config.icon}</GlobalText>
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <GlobalText style={[styles.label, {color: config.color}]}>
              {config.label}
            </GlobalText>
            {!item.is_read && (
              <View style={[styles.newBadge, {backgroundColor: config.color}]}>
                <GlobalText style={styles.newBadgeText}>جدید</GlobalText>
              </View>
            )}
          </View>
          <GlobalText style={[styles.message, {color: theme.colors.text}]}>
            {item.message}
          </GlobalText>
          <GlobalText style={styles.time}>{timeStr} · {dateStr}</GlobalText>
        </View>
      </View>
    );
  };

  return (
    <MainLayout>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <GlobalText style={[styles.title, {color: theme.colors.text}]}>
          اعلان‌ها
        </GlobalText>
        <GlobalText style={styles.subtitle}>
          {notifications.length} مورد
        </GlobalText>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{marginTop: 40}} color={theme.colors.secondary} />
      ) : isError ? (
        <View style={styles.empty}>
          <GlobalText style={styles.emptyIcon}>⚠️</GlobalText>
          <GlobalText style={styles.emptyHint}>خطا در بارگذاری</GlobalText>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.empty}>
          <GlobalText style={styles.emptyIcon}>🔔</GlobalText>
          <GlobalText style={[styles.emptyText, {color: theme.colors.text}]}>
            اعلانی وجود ندارد
          </GlobalText>
          <GlobalText style={styles.emptyHint}>
            اعلان‌های سیستمی، پرداخت‌ها و تیکت‌ها اینجا نمایش داده می‌شوند
          </GlobalText>
        </View>
      ) : (
        <FlatList
          data={notifications}
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
    width: 48, height: 48,
    borderRadius: 24,
    margin: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {fontSize: 22},
  content: {flex: 1, paddingVertical: 14, paddingRight: 8},
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {fontSize: 12, fontWeight: 'bold'},
  newBadge: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {fontSize: 10, color: '#fff'},
  message: {fontSize: 14, lineHeight: 22, textAlign: 'right'},
  time: {fontSize: 11, color: '#aaa', marginTop: 4},
  empty: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', padding: 40,
  },
  emptyIcon: {fontSize: 48, marginBottom: 16},
  emptyText: {fontSize: 16, fontWeight: 'bold', marginBottom: 8},
  emptyHint: {fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 22},
});

export default NotificationsScreen;