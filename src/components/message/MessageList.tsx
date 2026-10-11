import React, {useState} from 'react';import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native'; // NavigationProp را import کنید
import {useTheme} from '../../context/MainContext';
import {useAuth} from '../../context/AuthContext';
import {useDeleteAllMessages} from '../../api/mutations/messages/useDeleteAllMessages';
import {useDeleteMessage} from '../../api/mutations/messages/useDeleteMessage';
import {useMarkAsRead} from '../../api/mutations/messages/useMarkAsRead';
import {getUserAvatarSource} from '../../utils/imageUtils';
import GlobalText from '../GlobalText';
import EmptyState from '../EmptyState';

// !!! اگر RootStackParamList را تعریف کرده‌اید، از آن استفاده کنید، در غیر این صورت NavigationProp<any> کافی است !!!
// type RootStackParamList = {
//   Chat: { userId: number; nickname: string };
//   // ... سایر مسیرها
// };

interface MessageItemData {
  userId: number;
  name: string;
  avatarUrl?: string;
  lastMessageTime: string;
  lastMessageDate: string;
  snippet: string;
  unreadCount: number;
  type: 'inbox' | 'sent' | 'admin';
  gender?: 'male' | 'female';
}

interface Props {
  data: MessageItemData[];
  isLoading: boolean;
  totalUnread: number;
  onRefresh: () => void;
  title: string;
}

const ITEMS_PER_PAGE = 7;

const MessageList: React.FC<Props> = ({data, isLoading, onRefresh, title}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const {theme} = useTheme();
  const navigation = useNavigation<NavigationProp<any>>(); // تایپ را اصلاح کنید
  const {user: authUser} = useAuth();
  const deleteAllMutation = useDeleteAllMessages();
  const deleteMutation = useDeleteMessage();
  const markAsReadMutation = useMarkAsRead();
  const styles = getStyles(theme);

  const handleDeleteAll = () => {
    Alert.alert(
      'حذف همه گفتگوها',
      'آیا مطمئن هستید که می‌خواهید همه گفتگوها را حذف کنید؟ این عملیات قابل بازگشت نیست.',
      [
        {text: 'لغو', style: 'cancel'},
        {
          text: 'حذف همه',
          onPress: () => {
            deleteAllMutation.mutate(undefined, {
              onSuccess: () => {
                setShowDeleteModal(false);
                setSelectAll(false);
                Alert.alert('موفقیت', 'همه گفتگوها حذف شدند.');
              },
              onError: error => {
                console.error('Failed to delete all conversations:', error);
                Alert.alert('خطا', 'مشکلی در حذف همه گفتگوها پیش آمد.');
              },
            });
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleDeleteSingle = (targetUserId: number) => {
    Alert.alert(
      'حذف گفتگو',
      'آیا مطمئن هستید که می‌خواهید این گفتگو را حذف کنید؟',
      [
        {text: 'لغو', style: 'cancel'},
        {
          text: 'حذف',
          onPress: () => {
            deleteMutation.mutate(
              {targetUserId},
              {
                onSuccess: () => Alert.alert('گفتگو حذف شد'),
                onError: error => {
                  console.error('Failed to delete conversation:', error);
                  Alert.alert('خطا', 'مشکلی در حذف گفتگو پیش آمد.');
                },
              },
            );
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handlePressItem = (item: MessageItemData) => {
    markAsReadMutation.mutate(
      {targetUserId: item.userId},
      {
        onSuccess: () => {
          // می‌توانید اینجا optimistic update انجام دهید یا اجازه دهید invalidateQueries آن را مدیریت کند
        },
        onError: error => {
          console.error('Failed to mark messages as read:', error);
        },
      },
    );

    navigation.navigate('Chat', {userId: item.userId, nickname: item.name});
  };

  const renderItem = ({item}: {item: MessageItemData}) => (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: theme.colors.card}]}
      onPress={() => handlePressItem(item)}>
      <View style={styles.cardContent}>
        <Image
          source={getUserAvatarSource({
            avatarUrl: item.avatarUrl,
            gender: item.gender || 'men',
          })}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <GlobalText style={styles.name}>{item.name}</GlobalText>
          <GlobalText style={styles.snippet}>{item.snippet}</GlobalText>
        </View>
        <View style={styles.right}>
          <GlobalText style={styles.time}>{item.lastMessageTime}</GlobalText>
          <GlobalText style={styles.date}>{item.lastMessageDate}</GlobalText>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <GlobalText style={styles.badgeText}>
                {item.unreadCount}
              </GlobalText>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDeleteSingle(item.userId)}>
        <GlobalText>🗑️</GlobalText>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const paginatedData = data.slice(0, visibleCount);
  const hasMore = data.length > visibleCount;

  if (!isLoading && data.length === 0) {
    return <EmptyState icon="" title="گفتگویی وجود ندارد" />;
  }

  return (
    <View style={{flex: 1}}>
      {data.length > 0 && (
        <View style={styles.selectAllRow}>
          <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
            <GlobalText style={styles.deleteAllText}>
              حذف همه گفتگوها
            </GlobalText>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={paginatedData}
        keyExtractor={item => item.userId.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingHorizontal: 12}}
        refreshing={isLoading}
        onRefresh={onRefresh}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity
              style={styles.loadMore}
              onPress={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}>
              <GlobalText>بیشتر...</GlobalText>
            </TouchableOpacity>
          ) : null
        }
      />

      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <GlobalText style={styles.modalTitle}>حذف همه گفتگوها</GlobalText>
            <GlobalText>
              آیا مطمئن هستید؟ این عملیات قابل بازگشت نیست.
            </GlobalText>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <GlobalText>انصراف</GlobalText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteAll}
                style={styles.confirmBtn}>
                <GlobalText style={{color: 'white'}}>حذف</GlobalText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    selectAllRow: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: theme.colors.border,
      marginLeft: 10,
    },
    checked: {
      backgroundColor: theme.colors.primary,
    },
    deleteAllText: {
      color: 'red',
      fontWeight: 'bold',
      marginRight: 10,
    },
    card: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginVertical: 4,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardContent: {
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginLeft: 10,
    },
    info: {
      flex: 1,
      marginHorizontal: 10,
    },
    name: {
      fontWeight: 'bold',
      fontSize: 15,
      textAlign: 'right',
    },
    snippet: {
      color: '#666',
      fontSize: 13,
      marginTop: 2,
      textAlign: 'right',
    },
    right: {
      alignItems: 'center',
    },
    time: {
      fontSize: 12,
      color: '#888',
    },
    date: {
      fontSize: 11,
      color: '#aaa',
    },
    badge: {
      backgroundColor: 'red',
      borderRadius: 10,
      width: 22,
      height: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 4,
    },
    badgeText: {
      color: '#fff',
      fontSize: 12,
    },
    deleteBtn: {
      paddingLeft: 10,
    },
    loadMore: {
      alignItems: 'center',
      padding: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 12,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalButtons: {
      flexDirection: 'row',
      marginTop: 15,
      gap: 20,
    },
    confirmBtn: {
      backgroundColor: 'red',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
  });

export default MessageList;
