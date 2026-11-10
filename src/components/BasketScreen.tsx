import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import GlobalText from './GlobalText';
import CustomButton from './CustomButtonProps';
import {useTheme} from '../context/MainContext';
import type {RootStackParamList} from '../../types/rootStackParamList';

interface BasketItem {
  id: string | number;
  title: string;
  /** Backend catalog prices are integer rials. */
  price: number;
}

interface Props {
  basketItems: BasketItem[];
  userId?: number;
}

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export default function BasketScreen({basketItems}: Props) {
  const {theme} = useTheme();
  const navigation = useNavigation<Navigation>();

  const handleContinueToProducts = () => {
    // The old Basket route has no confirmed live direct-payment contract and
    // no in-repository caller. Do not reinterpret its legacy price as a wallet
    // deposit. Continue through the authoritative server-priced product flow.
    navigation.navigate('Products');
  };

  const renderItem = ({item}: {item: BasketItem}) => (
    <View style={styles.item}>
      <GlobalText style={{color: theme.colors.text}}>{item.title}</GlobalText>
      <GlobalText style={{color: theme.colors.text}}>
        قیمت نهایی در فروشگاه از سرور دریافت می‌شود
      </GlobalText>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={basketItems}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{paddingBottom: 10}}
        ListFooterComponent={
          <View>
            <View
              style={[
                styles.alertBox,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}>
              <GlobalText style={[styles.alertText1, {color: theme.colors.text}]}>
                مسیر پرداخت قدیمی این صفحه دیگر به درگاه معتبر متصل نیست.
              </GlobalText>
              <GlobalText style={{color: theme.colors.text}}>
                برای جلوگیری از مبلغ یا سفارش اشتباه، خرید را از فروشگاه ادامه دهید؛ قیمت و کد بسته مستقیماً از سرور دریافت می‌شود.
              </GlobalText>
            </View>

            <CustomButton
              onPress={handleContinueToProducts}
              gradient
              label="بازگشت به فروشگاه و انتخاب بسته"
              style={styles.btnText}
              disabled={!basketItems.length}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'flex-end',
  },
  alertBox: {
    padding: 15,
    marginVertical: 10,
    alignItems: 'flex-end',
    borderRadius: 5,
    borderWidth: 1,
    gap: 6,
  },
  alertText1: {fontWeight: 'bold'},
  warningBox: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#8F87F1',
    borderWidth: 1,
  },
  warningText: {fontWeight: 'bold', textAlign: 'right'},
  btnText: {marginVertical: 7, backgroundColor: '#86A788'},
});
