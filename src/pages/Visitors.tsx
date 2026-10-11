import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import MainLayout from '../theme/MainLayout';
import SortSelector from '../components/SortSelector';
import {useTheme} from '../context/MainContext';
import {useAuth} from '../context/AuthContext';
import {useVisitors} from '../api/mutations/visitors/visitorsList';
import {useVisitedUsers} from '../api/mutations/visitors/useVisitedUsers';
import VisitorsList from '../components/user/VisitorsList';
import SectionWithLine from '../components/SectionWithLine';

const Visitors: React.FC = () => {
  const {isDarkMode} = useTheme();
  const [currentSort, setCurrentSort] = useState('transacion');
  const {user} = useAuth();
  const icons = {
    contact: isDarkMode
      ? require('../assets/img/wh_sort.png')
      : require('../assets/img/da_sort.png'),
  };
  const visitors = useVisitors();
  const visited = useVisitedUsers();
  return (
    <MainLayout>
      <SectionWithLine text="بازدیدها" />
      <View style={{flex: 1}}>
        <SortSelector
          iconSource={icons.contact}
          iconActiveColor="#ff5bfa"
          active={true}
          options={[
            {label: 'بازدیدکننده گان', value: 'visitors'},
            {label: 'بازدید شده ها', value: 'visited'},
          ]}
          selectedValue={currentSort}
          onSelect={setCurrentSort}
          title="مرتب‌سازی بر اساس"
          buttonLabel="فیلتر کنید"
        />
        <ScrollView contentContainerStyle={styles.container}>
          <VisitorsList
            title="افرادی که از پروفایل من بازدید کردند"
            data={visitors.data}
            isLoading={visitors.isLoading}
          />

          <VisitorsList
            title="پروفایل‌هایی که من بازدید کردم"
            data={visited.data}
            isLoading={visited.isLoading}
          />
        </ScrollView>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});
export default Visitors;
