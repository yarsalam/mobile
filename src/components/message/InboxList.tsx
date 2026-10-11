// src/components/messages/InboxList.tsx
import React from 'react';
import { useInboxGrouped } from '../../api/mutations/messages/useInboxGrouped';
import { useAuth } from '../../context/AuthContext';
import MessageList from './MessageList';

const InboxList = () => {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useInboxGrouped(user?.id);

  const mappedData = (data || []).map((msg) => ({
    userId: msg.userId,
    name: msg.name,
    avatarUrl: msg.avatar,
    lastMessageTime: msg.lastFreeMessageTime || msg.lastPaidMessageTime,
    lastMessageDate: msg.lastFreeMessageDate || msg.lastPaidMessageDate,
    snippet: msg.lastMessageSnippet,
    unreadCount: msg.unreadFreeMessagesCount || msg.unreadPaidMessagesCount || 0,
    type: 'inbox',
  }));

  return (
    <MessageList
      data={mappedData}
      isLoading={isLoading}
      totalUnread={mappedData.reduce((sum, d) => sum + d.unreadCount, 0)}
      onRefresh={refetch}
      title="دریافتی"
    />
  );
};

export default InboxList;