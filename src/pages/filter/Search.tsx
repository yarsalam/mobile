import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import GlobalText from '../../components/GlobalText';
import UserSearchList from '../../components/user/UserSearchList';
import {useFilter} from '../../context/FilterContext';
import {useNavigation} from '@react-navigation/native';

const Search: React.FC = () => {
  const navigation = useNavigation();
  const {activeFilterCount} = useFilter();

  const icons = {
    filter: require('../../assets/img/filter.png'), // آیکون فیلتر خودتون رو اینجا بذارید
  };

  return (
    <MainLayout>
      <SectionWithLine text="جستجو" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Filter' as never)}
          style={styles.goback}>
          <Image source={icons.filter} style={styles.arrow} />
          <GlobalText style={styles.backButton}>فیلترها</GlobalText>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <GlobalText style={styles.filterBadgeText}>
                {activeFilterCount}
              </GlobalText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <UserSearchList />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  arrow: {width: 22, height: 22, alignSelf: 'center'},
  header: {},
  goback: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 2,
  },
  backButton: {fontSize: 20, color: '#2a76a8', marginRight: 10},
  filterBadge: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  filterBadgeText: {color: '#fff', fontSize: 12},
});

export default Search;
