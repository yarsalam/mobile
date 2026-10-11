import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {useAuth} from '../../context/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {useTicketsList} from '../../api/mutations/tickets/useTicketsList';
import CustomButton from '../../components/CustomButtonProps';

const statusConfig: Record<
  string,
  {color: string; label: string; icon: string}
> = {
  open: {color: '#F59E0B', label: 'باز', icon: '🟡'},
  in_progress: {color: '#3B82F6', label: 'در جریان', icon: '🔵'},
  resolved: {color: '#10B981', label: 'حل شده', icon: '🟢'},
  closed: {color: '#6B7280', label: 'بسته', icon: '⚫'},
  escalated: {color: '#EF4444', label: 'فوری', icon: '🔴'},
};

const priorityConfig: Record<string, {color: string; label: string}> = {
  low: {color: '#10B981', label: 'کم'},
  medium: {color: '#F59E0B', label: 'متوسط'},
  high: {color: '#EF4444', label: 'زیاد'},
  urgent: {color: '#7C3AED', label: 'فوری'},
};

const categoryLabel: Record<string, string> = {
  technical: '🔧 پشتیبانی فنی',
  billing: '💳 مالی و اداری',
  account: '👤 حسابداری',
  feature_request: '💡 پیشنهادات و انتقادات',
  report: '🚨 گزارش',
  other: '📋 سایر',
};

const SupportListScreen = () => {
  const {user} = useAuth();
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {data: tickets, isLoading, refetch} = useTicketsList(user?.id);
  const styles = getStyles(theme);

  const renderItem = ({item}: any) => {
    const status = statusConfig[item.status] || {
      color: '#aaa',
      label: item.status,
      icon: '⚪',
    };
    const priority = priorityConfig[item.priority];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate(
            'TicketDetail' as never,
            {ticketId: item.id} as never,
          )
        }
        activeOpacity={0.8}>
        {/* نوار رنگی سمت راست */}
        <View style={[styles.sideBar, {backgroundColor: status.color}]} />

        <View style={styles.cardBody}>
          {/* ردیف اول: عنوان + وضعیت */}
          <View style={styles.row}>
            <GlobalText style={styles.title} numberOfLines={1}>
              {item.title}
            </GlobalText>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: status.color + '22',
                  borderColor: status.color,
                },
              ]}>
              <GlobalText style={[styles.statusText, {color: status.color}]}>
                {status.icon} {status.label}
              </GlobalText>
            </View>
          </View>

          {/* ردیف دوم: دسته‌بندی + اولویت */}
          <View style={styles.row}>
            <GlobalText style={styles.category}>
              {categoryLabel[item.category] || item.category}
            </GlobalText>
            {priority && (
              <View style={[styles.priorityBadge]}>
                <GlobalText
                  style={[styles.priorityText, {color: priority.color}]}>
                  {priority.label}
                </GlobalText>
              </View>
            )}
          </View>

          {/* ردیف سوم: تاریخ */}
          <GlobalText style={styles.date}>
            🕒 {new Date(item.createdAt).toLocaleDateString('fa-IR')}
          </GlobalText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout>
      <SectionWithLine text="تیکت‌های پشتیبانی" />
      <FlatList
        data={tickets}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlobalText style={styles.emptyIcon}>🎫</GlobalText>
            <GlobalText style={styles.emptyText}>تیکتی وجود ندارد</GlobalText>
            <GlobalText style={styles.emptySubText}>
              برای ثبت مشکل یا پیشنهاد از دکمه زیر استفاده کنید
            </GlobalText>
          </View>
        }
        ListFooterComponent={
          <CustomButton
            label="+ ثبت تیکت جدید"
            onPress={() => navigation.navigate('CreateTicket' as never)}
            gradient
            style={styles.fab}
          />
        }
      />
    </MainLayout>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    list: {
      padding: 16,
      paddingBottom: 32,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.cardBackground || theme.colors.background,
      borderRadius: 12,
      marginBottom: 12,
      overflow: 'hidden',
      borderWidth: 0.5,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    sideBar: {
      width: 5,
      alignSelf: 'stretch',
    },
    cardBody: {
      flex: 1,
      padding: 12,
      gap: 6,
    },
    row: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
    },
    title: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'right',
    },
    statusBadge: {
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical:1,
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    priorityBadge: {
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    priorityText: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    category: {
      flex: 1,
      fontSize: 15,
      color: theme.colors.text,
      textAlign: 'right',
      opacity: 0.7,
    },
    date: {
      fontSize: 14,
      color: theme.colors.text,
      textAlign: 'left',
      opacity: 0.5,
      marginTop: 2,
    },
    emptyContainer: {
      alignItems: 'center',
      marginTop: 60,
      gap: 8,
    },
    emptyIcon: {
      fontSize: 48,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    emptySubText: {
      fontSize: 13,
      color: theme.colors.text,
      opacity: 0.6,
      textAlign: 'center',
      paddingHorizontal: 32,
    },
    fab: {
      marginTop: 16,
    },
  });

export default SupportListScreen;
