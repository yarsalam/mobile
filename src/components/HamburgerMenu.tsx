import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GlobalText from '../components/GlobalText';
import MainLayout from '../theme/MainLayout';
import {useTheme} from '../context/MainContext';
import CustomButton from './CustomButtonProps';
import {useLogoutMutation} from '../api/auth/mutations/useLogoutMutation';
import ConfirmLogoutModal from './user/ConfirmLogoutModal';

const {width} = Dimensions.get('window');
const CARD_SIZE = width / 2 - 25; // دو کارت در هر ردیف با فاصله

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  screen: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'settings',
    title: 'تنظیمات',
    icon: require('../assets/img/sett.png'),
    screen: 'Settings',
  },
  {
    id: '1',
    title: 'تماس با ما',
    icon: require('../assets/img/man_avt.png'),
    screen: 'SupportList',
  },
  {
    id: '2',
    title: 'تراکنشهای مالی',
    icon: require('../assets/img/noti.png'),
    screen: 'Transactions',
  },
  {
    id: '3',
    title: 'خرید عضویت',
    icon: require('../assets/img/sett.png'),
    screen: 'Products',
  },
  {
    id: '4',
    title: 'بازدیدکنندگان',
    icon: require('../assets/img/fav.png'),
    screen: 'Visitors',
  },
  {
    id: '5',
    title: 'تعلیق/انصراف',
    icon: require('../assets/img/ticket.png'),
    screen: 'AccountActions',
  },
  {
    id: '6',
    title: 'قوانین',
    icon: require('../assets/img/rul.png'),
    screen: 'Rules',
  },
];

const HamburgerMenu: React.FC = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [showMore, setShowMore] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // نمایش فقط ۴ کارت اول و در صورت کلیک روی بیشتر ببینید، نمایش همه کارت‌ها
  const visibleItems = showMore ? menuItems : menuItems.slice(0, 4);

  const textColor = theme.colors.text;
  const cardBackground = theme.colors.card;
  const shadowColor = theme.colors.border;
  const logoutMutation = useLogoutMutation();

  return (
    <MainLayout>
      <ConfirmLogoutModal
        visible={showLogoutModal}
        loading={logoutMutation.isPending}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          try {
            await logoutMutation.mutateAsync();
            setShowLogoutModal(false);
          } catch (e) {
            console.log(e);
          }
        }}
      />
      <View style={[styles.container]}>
        <FlatList
          data={visibleItems}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.menuItem,
                {backgroundColor: cardBackground, shadowColor},
              ]}
              onPress={() => navigation.navigate(item.screen as never)}>
              <Image source={item.icon} style={styles.icon} />
              <GlobalText style={{color: textColor}}>{item.title}</GlobalText>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowMore(!showMore)}>
              <GlobalText style={{color: theme.colors.text}}>
                {showMore ? 'کمتر ببینید' : 'بیشتر ببینید'}
              </GlobalText>
            </TouchableOpacity>
          }
        />
        <CustomButton
          label="خروج"
          style={{backgroundColor: '#d9534f', marginBottom: 20, width: '90%'}}
          textStyle={{color: '#fff'}}
          onPress={() => setShowLogoutModal(true)}
          gradient
        />
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },

  menuItem: {
    width: CARD_SIZE,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    paddingLeft: 10,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 5,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 0.6,
    borderColor: '#334155',
    shadowOffset: {width: 0, height: 2},
  },
  icon: {
    width: 35,
    height: 35,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  showMoreButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  logoutButton: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default HamburgerMenu;
