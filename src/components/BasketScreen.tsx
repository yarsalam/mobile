import React from 'react';
import {View, FlatList, StyleSheet, Alert} from 'react-native';
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

  const totalRials = basketItems.reduce(
    (total, item) => total + (Number.isSafeInteger(item.price) ? item.price : 0),
    0,
  );
  const productLabel = basketItems.map(item => item.title).filter(Boolean).join('، ');
  const bundleCode = basketItems.length === 1 ? String(basketItems[0].id) : '';

  const handleWalletDeposit = () => {
    if (
      basketItems.length !== 1 ||
      !bundleCode ||
      !Number.isSafeInteger(totalRials) ||
      totalRials <= 0
    ) {
      Alert.alert(
        'سبد خرید قابل پرداخت نیست',
        'برای خرید، لطفاً محصول را از فروشگاه انتخاب کنید تا کد بسته و مبلغ معتبر از سرور دریافت شود.',
      );
      return;
    }

    navigation.navigate('Deposit', {
      amountRials: totalRials,
      productLabel,
      bundleCode,
    });
  };

  const renderItem = ({item}: {item: BasketItem}) => (
    <View style={styles.item}>
      <GlobalText style={{color: theme.colors.text}}>{item.title}</GlobalText>
      <GlobalText style={{color: theme.colors.text}}>
        {(item.price / 10).toLocaleString('fa-IR')} تومان
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
                پرداخت از مسیر امن کیف پول یارسلام انجام می‌شود.
              </GlobalText>
              <GlobalText style={{color: theme.colors.text}}>
                برای کارت‌به‌کارت یا USDT ابتدا کیف پول خود را شارژ کنید.
              </GlobalText>
            </View>

            <View
              style={[styles.warningBox, {borderColor: theme.colors.border}]}>
              <GlobalText style={[styles.warningText, {color: theme.colors.text}]}>
                این مرحله فقط کیف پول را شارژ می‌کند. پس از تأیید واریز، به فروشگاه برگردید و بسته را با موجودی کیف پول خریداری کنید.
              </GlobalText>
            </View>

            <GlobalText style={[styles.total, {color: theme.colors.text}]}>
              مبلغ بسته: {(totalRials / 10).toLocaleString('fa-IR')} تومان
            </GlobalText>

            <CustomButton
              onPress={handleWalletDeposit}
              gradient
              label="رفتن به روش‌های شارژ امن کیف پول"
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
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 12,
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
