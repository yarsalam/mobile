import React from 'react';
import {View, StyleSheet} from 'react-native';
import MainLayout from '../../theme/MainLayout';
import SectionWithLine from '../../components/SectionWithLine';
import BasketScreen from '../../components/BasketScreen';
import {useRoute} from '@react-navigation/native';
import GlobalText from '../../components/GlobalText';
import {useTheme} from '../../context/MainContext';

const Basket: React.FC = () => {
  const route = useRoute();
  const {theme} = useTheme();
  const color = theme.colors.text;
  const {id, title, price} = route.params as {
    id: string | number;
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
        <BasketScreen basketItems={basketItems} />
      </View>
    </MainLayout>
  );
};
const styles = StyleSheet.create({
  content: {textAlign: 'right', fontSize: 18},
});
export default Basket;
