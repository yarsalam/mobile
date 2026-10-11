import React from 'react';
import {useRoute} from '@react-navigation/native';
import {useAuth} from '../context/AuthContext';
import UserProfileMobile from '../components/user/UserProfileMobile';
import MainLayout from '../theme/MainLayout';
import {useUserProfile} from '../api/mutations/useUserProfileMutation';

const UserProfile = () => {
  const route = useRoute();
  const {user: authUser} = useAuth();
  const params = route.params as any;

  // اگر کاربر خودش است نیازی به fetch نیست
  const isOwnProfile =
    !params?.user && (!params?.user || params.user === authUser?.id);

  const userId = isOwnProfile ? undefined : params?.user; // فقط برای پروفایل دیگران fetch می‌کنیم

  const {data: fetchedUser} = useUserProfile(userId);

  // حالت‌های مختلف
  if (isOwnProfile) {
    // پروفایل خود کاربر؛ اطلاعات از auth موجود است
    return (
      <MainLayout>
        <UserProfileMobile user={undefined} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <UserProfileMobile user={fetchedUser} />
    </MainLayout>
  );
};

export default UserProfile;
