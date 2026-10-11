import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import BasketScreen from '../../components/BasketScreen';
import {useRoute} from '@react-navigation/native';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';
import {useAuth} from '../../context/AuthContext';

const Basket: React.FC = () => {
  const route = useRoute();
  const {user} = useAuth();
  const {isDarkMode} = useTheme();
  
  const color = isDarkMode ? '#fff' : 'black';
  const {id, title, price} = route.params as {
    id: number;
    title: string;
    price: number;
  };
  const basketItems = [
    {
      id,
      title,
      price,
    },
  ];
  return (
    <MainLayout>
      <SectionWithLine text="پرداخت" />
      <View style={{flex: 1}}>
        <GlobalText style={[styles.content, {color}]}>خرید شما:</GlobalText>
        <BasketScreen basketItems={basketItems} userId={user.id} />
      </View>
    </MainLayout>
  );
};
const styles = StyleSheet.create({
  content: {textAlign: 'right', fontSize: 18},
});
export default Basket;
