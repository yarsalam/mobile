import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {GroupedMessageDto} from '../../types/messageType';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../context/ToastContext';
import GlobalText from './GlobalText';
import {API_BASE_URL} from '../config/api';

interface Props {
  data: GroupedMessageDto;
}

const MessageItem: React.FC<Props> = ({data}) => {
  const {
    name,
    avatar,
    lastMessageSnippet,
    isFree,
    unread,
    blockedByMe,
    blockedMe,
    adminBlocked,
    resigned,
    lastFreeMessageDate,
    lastFreeMessageTime,
    lastPaidMessageDate,
    lastPaidMessageTime,
    unreadFreeMessagesCount,
    unreadPaidMessagesCount,
  } = data;

  const navigation = useNavigation();
  const {showToast} = useToast();

  const handlePress = () => {
    if (adminBlocked)
      return showToast('کاربر توسط مدیریت مسدود شده است.', 'error');
    if (resigned) return showToast('کاربر انصراف داده است.', 'error');
    if (blockedByMe) return showToast('شما کاربر را مسدود کرده‌اید.', 'error');
    if (blockedMe) return showToast('کاربر شما را مسدود کرده است.', 'error');

    // رفتن به صفحه چت
    navigation.navigate(isFree ? 'FreeChat' : 'PaidChat', { userId: data.userId });
  };

  const time = isFree ? lastFreeMessageTime : lastPaidMessageTime;
  const date = isFree ? lastFreeMessageDate : lastPaidMessageDate;
  const unreadCount = isFree
    ? unreadFreeMessagesCount
    : unreadPaidMessagesCount;
  const BASE_URL = API_BASE_URL;

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, unread ? styles.unread : null]}>
      <View style={styles.left}>
        <Image
          source={{uri: `${BASE_URL}${avatar}?t=${Date.now()}`}}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <GlobalText style={styles.name}>{name}</GlobalText>
          <GlobalText style={styles.snippet}>
            {isFree ? 'پیام رایگان' : lastMessageSnippet}
          </GlobalText>
        </View>
      </View>
      <View style={styles.right}>
        <View style={{flexDirection: 'column'}}>
          <GlobalText style={styles.time}>{time}</GlobalText>
          <GlobalText style={styles.date}>{date}</GlobalText>
        </View>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    backgroundColor: '#003161',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unread: {
    backgroundColor: '#0ea5e9',
  },
  left: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  info: {
    flexDirection: 'column',
  },
  name: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'right',
  },
  snippet: {
    color: 'white',
    fontSize: 13,
    maxWidth: 160,
  },
  right: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    gap: 4,
  },
  time: {
    color: '#fff',
    fontSize: 11,
  },
  date: {
    color: '#ccc',
    fontSize: 11,
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
  },
});

export default MessageItem;
