import React from 'react';
import MainLayout from '../../theme/MainLayout';
import {ChangeMobile} from '../../components/user/ChangeMobile';
import SectionWithLine from '../../components/SectionWithLine';

const ChangeUserMobile: React.FC = () => {
  return (
    <MainLayout>
      <SectionWithLine text="تغییر شماره موبایل" />
      <ChangeMobile />
    </MainLayout>
  );
};

export default ChangeUserMobile;
