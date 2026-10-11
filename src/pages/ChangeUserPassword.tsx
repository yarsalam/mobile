import React from 'react';

import MainLayout from '../theme/MainLayout';
import SectionWithLine from '../components/SectionWithLine';
import { ChangePassword } from '../components/user/ChangePassword';

const ChangeUserPassword: React.FC = () => {
  return (
    <MainLayout>
      <SectionWithLine text="تغییر رمز عبور" />
        <ChangePassword />
    </MainLayout>
  );
};

export default ChangeUserPassword;
