import React from 'react';
import { useSendGrouped } from '../../api/mutations/messages/useSentGrouped';
import { useAuth } from '../../context/AuthContext';
import MessageList from './MessageList';

const SentList = () => {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useSendGrouped(user?.id);

  const mappedData = (data || []).map((msg) => ({
    userId: msg.userId,
    name: msg.name,
    avatarUrl: msg.avatar,
    lastMessageTime: msg.lastFreeMessageTime || msg.lastPaidMessageTime,
    lastMessageDate: msg.lastFreeMessageDate || msg.lastPaidMessageDate,
    snippet: msg.lastMessageSnippet,
    unreadCount: 0, // پیام ارسالی برای فرستنده خوانده نشده محسوب نمی‌شود
    type: 'sent',
  }));

  return (
    <MessageList
      data={mappedData}
      isLoading={isLoading}
      totalUnread={0}
      onRefresh={refetch}
      title="ارسالی"
    />
  );
};

export default SentList;