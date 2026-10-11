import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../context/MainContext';
import {useFilter} from '../../context/FilterContext';
import {useNavigation} from '@react-navigation/native';
import GlobalText from '../../components/GlobalText';
import SubFilterDrawer from './SubFilterDrawer';
import {useFilterCount} from '../../api/mutations/filters/useFilterCount';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import CustomButton from '../../components/CustomButtonProps';

const FilterScreen = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {filters, setFilters, clearFilters} = useFilter();
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const {
    data: countData,
    isLoading: countLoading,
    isFetching: countFetching,
  } = useFilterCount(filters);

  const openSub = (key: string) => setSubCategory(key);
  const closeSub = () => setSubCategory(null);

  const handleSubSave = (key: string, value: any) => {
    setFilters({...filters, [key]: value});
    closeSub();
  };

  const mainCategories = [
    {label: 'محل سکونت', key: 'city'},
    {label: 'تحصیلات', key: 'education'},
    {label: 'سن', key: 'age'},
    {label: 'وزن', key: 'weight'},
    {label: 'مذهب', key: 'religion'},
    {label: 'سلامت', key: 'health'},
    {label: 'عکس دار', key: 'hasPhoto'},
    {label: 'قد', key: 'height'},
  ];

  const icons = {
    arrow: require('../../assets/img/back.png'),
  };

  return (
    <MainLayout>
      <SectionWithLine text="فیلترها" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.goback}>
          <Image source={icons.arrow} style={styles.arrow} />
          <GlobalText style={styles.backButton}>بازگشت</GlobalText>
        </TouchableOpacity>
      </View>

      {/* لیست دسته‌بندی‌ها در ScrollView مستقل، ارتفاع محدود تا با دکمه‌ها قاطی نشه */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{paddingBottom: 8}}>
        {mainCategories.map(cat => {
          const val = filters[cat.key];
          const hasValue = Array.isArray(val) ? val.length > 0 : !!val;
          return (
            <TouchableOpacity
              key={cat.key}
              style={styles.filterItem}
              onPress={() => openSub(cat.key)}>
              <GlobalText>{cat.label}</GlobalText>
              {hasValue && (
                <GlobalText style={{color: 'red'}}>
                  {Array.isArray(val) ? val.length : '✓'}
                </GlobalText>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* دکمه‌های پایین — همیشه جدا و ثابت، بیرون از لیست دسته‌بندی */}
      <View style={styles.buttons}>
        <CustomButton
          label={`مشاهده ${countData?.count ?? 0} کاربر`}
          onPress={() => navigation.goBack()}
          gradient
          loading={countLoading || countFetching}
        />
        <CustomButton
          label="حذف همه فیلترها"
          onPress={() => {
            clearFilters();
            navigation.goBack();
          }}
        />
      </View>

      <Modal
        visible={!!subCategory}
        animationType="slide"
        transparent={false}
        onRequestClose={closeSub}>
        <SubFilterDrawer
          categoryKey={subCategory as string}
          currentValue={filters[subCategory as string]}
          onSave={val => handleSubSave(subCategory as string, val)}
          onClose={closeSub}
          filterType={
            subCategory === 'age' ||
            subCategory === 'weight' ||
            subCategory === 'height'
              ? 'range'
              : 'list'
          }
        />
      </Modal>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  arrow: {width: 22, height: 22, alignSelf: 'center'},
  header: {},
  goback: {flexDirection: 'row', marginBottom: 20, gap: 5},
  backButton: {fontSize: 18, color: '#2a76a8', marginRight: 16},
  list: {flexGrow: 0, maxHeight: '60%'},
  filterItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {marginTop: 20, gap: 12, paddingHorizontal: 20},
});

export default FilterScreen;
