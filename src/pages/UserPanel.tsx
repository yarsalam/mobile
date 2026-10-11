import React, {useState} from 'react';
import {FlatList} from 'react-native'; // ← ScrollView را حذف کن
import MainLayout from '../theme/MainLayout';
import SectionTitle from '../components/SectionTitle';
import FeedSlider from '../components/user/FeedSlider';
import SuggestionsList from '../components/user/SuggestionsList';
import VisitorsList from '../components/user/VisitorsList';
import NewUsersStories from '../components/user/NewUsersStories';
import {useVisitors} from '../api/mutations/visitors/visitorsList';
import {Visitor} from '../components/user/VisitorsList';
import {useNewUsers} from '../api/mutations/useNewUsers';
import {getFullImageUrl} from '../utils/imageUtils';
import {useMarkVisitorRead} from '../api/mutations/visitors/useMarkVisitorRead';

const UserPanel: React.FC = () => {
  const {data: visitorsData, isLoading: visitorsLoading} = useVisitors();
  const {data: newUsers, isLoading: newUsersLoading} = useNewUsers(5);
  const markRead = useMarkVisitorRead();
  const handleVisitorPress = (id: number) => {
    markRead.mutate(id);
  };

  const visitors: Visitor[] = React.useMemo(() => {
    if (!visitorsData) return [];
    return visitorsData.map((v: any) => ({
      id: v.visitorId,
      name: v.visitor?.nickname || 'کاربر',
      avatarUrl: getFullImageUrl(v.visitor?.userImages?.[0]?.url),
      time: v.visitedAt
        ? new Date(v.visitedAt).toLocaleDateString('fa-IR') +
          ' ساعت ' +
          new Date(v.visitedAt).toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',
      visitCount: v.visitCount || 1,
      checked: v.isRead, // ← مستقیم از DB
      gender: v.visitor?.gender,
    }));
  }, [visitorsData]);

  // بخش‌های صفحه به عنوان آیتم‌های FlatList
  const sections = [
    {key: 'feed'},
    {key: 'suggestions'},
    {key: 'visitors'},
    {key: 'newUsers'},
  ];

  const renderSection = ({item}: {item: {key: string}}) => {
    switch (item.key) {
      case 'feed':
        return (
          <>
            <SectionTitle
              text="پیشنهادهای ویژه امروز 🔥"
              gradientColors={['#F59E0B', '#F97316']}
            />
            <FeedSlider />
          </>
        );
      case 'suggestions':
        return (
          <>
            <SectionTitle
              text="پیشنهاد هوشمند"
              gradientColors={['#1b10b9ff', '#d33434ff']}
            />
            <SuggestionsList />
          </>
        );
      case 'visitors':
        return (
          <>
            <SectionTitle
              text="بازدیدکنندگان پروفایل من"
              gradientColors={['#10B981', '#34D399']}
            />
            <VisitorsList
              data={visitors} // ← بدون map اضافه
              isLoading={visitorsLoading}
              onVisitorPress={handleVisitorPress}
            />
          </>
        );
      case 'newUsers':
        return (
          <>
            <SectionTitle
              text="جدیدترین کاربران"
              gradientColors={['#1b10b9ff', '#d33434ff']}
            />
            <NewUsersStories
              users={newUsers || []}
              isLoading={newUsersLoading}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true} // ← مهم
      />
    </MainLayout>
  );
};

export default UserPanel;
