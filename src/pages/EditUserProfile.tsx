import React from 'react';

import MainLayout from '../theme/MainLayout';
import {EditProfile} from '../components/user/EditProfile';
import SectionWithLine from '../components/SectionWithLine';

const EditUserProfile: React.FC = () => {
  return (
    <MainLayout>
      <SectionWithLine text="ویرایش پروفایل" />
      <EditProfile />
    </MainLayout>
  );
};

export default EditUserProfile;
