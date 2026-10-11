import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import {useTheme} from '../../context/MainContext';
import InboxList from '../../components/message/InboxList';
import SentList from '../../components/message/SentList';
import AdminList from '../../components/message/AdminList';
import SortSelector from '../../components/SortSelector';

const SORT_OPTIONS = [
  {label: 'دریافتی', value: 'inbox'},
  {label: 'ارسالی', value: 'sent'},
  {label: 'مدیریت', value: 'admin'},
];

const Messages = () => {
  const {theme} = useTheme();
  const [tab, setTab] = useState<'inbox' | 'sent' | 'admin'>('inbox');
  const styles = getStyles(theme);

  const icons = {
    sort: require('../../assets/img/sort.png'),
  };

  return (
    <MainLayout>
      <SectionWithLine text="پیام‌ها" />
      <View style={styles.sortWrapper}>
        <SortSelector
          iconSource={icons.sort}
          options={SORT_OPTIONS}
          selectedValue={tab}
          onSelect={value => setTab(value as 'inbox' | 'sent' | 'admin')}
          title="دسته‌بندی پیام‌ها"
          buttonLabel="انتخاب کنید"
        />
      </View>
      <View style={{flex: 1}}>
        {tab === 'inbox' && <InboxList />}
        {tab === 'sent' && <SentList />}
        {tab === 'admin' && <AdminList />}
      </View>
    </MainLayout>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    sortWrapper: {
      paddingHorizontal: 16,
      marginVertical: 10,
    },
  });

export default Messages;