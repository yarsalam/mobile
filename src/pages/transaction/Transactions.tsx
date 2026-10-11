import React, {useState} from 'react';
import {View} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import SortSelector from '../../components/SortSelector';
import TransactionList from '../../components/TransactionList';

const Transactions: React.FC = () => {
  const [currentSort, setCurrentSort] = useState('transacion');
  const icons = {
    contact: require('../../assets/img/sort.png'),
  };

  return (
    <MainLayout>
      <SectionWithLine text="تراکنشهای مالی/وضعیت اشتراک" />
      <View style={{flex: 1}}>
        <SortSelector
          iconSource={icons.contact}
          iconActiveColor="#ff5bfa"
          active={true}
          options={[
            {label: 'تراکنشهای مالی', value: 'transacion'},
            {label: 'وضعیت اشتراک', value: 'subscriptionStatus'},
          ]}
          selectedValue={currentSort}
          onSelect={setCurrentSort}
          title="مرتب‌سازی بر اساس"
          buttonLabel="فیلتر کنید"
        />
        <TransactionList />
      </View>
    </MainLayout>
  );
};

export default Transactions;
