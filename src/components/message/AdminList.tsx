import React from 'react';
import MessageList from './MessageList';

const FAKE_ADMIN = [
  {
    userId: 999,
    name: 'پشتیبانی یارسلام',
    avatarUrl: null,
    lastMessageTime: '۱۰:۳۰',
    lastMessageDate: '۱۴۰۲/۱۲/۱۰',
    snippet: 'خوش آمدید',
    unreadCount: 2,
    type: 'admin',
  },
];

const AdminList = () => {
  return (
    <MessageList
      data={FAKE_ADMIN}
      isLoading={false}
      totalUnread={2}
      onRefresh={() => {}}
      title="مدیریت"
    />
  );
};

export default AdminList;