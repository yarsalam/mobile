import React from 'react';
import {View, FlatList, StyleSheet, Linking} from 'react-native';
import GlobalText from './GlobalText';
import CustomButton from './CustomButtonProps';
import {useTheme} from '../context/MainContext';
import {useAuth} from '../context/AuthContext';

const BasketScreen = ({basketItems, userId}) => {
  const {theme} = useTheme();
  const {user} = useAuth();

  const handleOnlinePayment = () => {
    // ریدایرکت به درگاه پرداخت
    const url = `https://yoursite.com/payment?method=online&gateway=online&id=${userId}`;
    Linking.openURL(url);
  };

  const handleOfflinePayment = () => {
    // ریدایرکت به صفحه ثبت پرداخت دستی
    Linking.openURL('https://yoursite.com/cart');
  };

  const renderItem = ({item}) => (
    <View style={styles.item}>
      <GlobalText style={{color: theme.colors.text}}>{item.title}</GlobalText>
      <GlobalText style={{color: theme.colors.text}}>
        {item.price} هزار تومان
      </GlobalText>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={basketItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingBottom: 10}}
        ListFooterComponent={
          <>
            {/* <View style={styles.summary}>
        <GlobalText>جمع آیتم‌ها: {subTotal} هزار تومان</GlobalText>
        <GlobalText>جمع کل سبد خرید: {subTotal} هزار تومان</GlobalText>
      </View> */}

            <View
              style={[
                styles.alertBox,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}>
              <GlobalText
                style={[styles.alertText1, {color: theme.colors.text}]}>
                برای پرداخت صورتحساب میتوانید به دو روش اقدام نمایید:
              </GlobalText>
              <GlobalText style={{color: theme.colors.text}}>
                ۱- پرداخت آنلاین (درگاه بانکی)
              </GlobalText>
              <GlobalText style={{color: theme.colors.text}}>
                ۲- پرداخت خارج از سایت (همراه بانک و ...)
              </GlobalText>
            </View>

            <View
              style={[styles.warningBox, {borderColor: theme.colors.border}]}>
              <GlobalText
                style={[styles.warningText, {color: theme.colors.text}]}>
                برای پرداخت آنلاین باید در لحظه واریز، فیلترشکن خود را خاموش
                کنید.
              </GlobalText>
              <GlobalText
                style={[
                  {marginTop: 10, textAlign: 'right'},
                  {color: theme.colors.text},
                ]}>
                ویدیو زیر مراحل پرداخت آنلاین را به صورت کامل نشان می‌دهد:
              </GlobalText>
            </View>

            {/* <Video
              source={{
                uri: 'https://yoursite.com/images/upload/yarsalamTransactio.mp4',
              }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              useNativeControls
              style={{width: '100%', height: 200, marginVertical: 20}}
            /> */}

            <CustomButton
              onPress={handleOnlinePayment}
              gradient={true}
              label="ورود به درگاه بانکی و پرداخت آنلاین"
              style={styles.btnText}
            />
            <CustomButton
              label="پرداخت و ثبت واریز خارج از سایت"
              gradient={true}
              onPress={handleOfflinePayment}
            />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},

  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'flex-end',
  },
  summary: {marginVertical: 20, padding: 10, backgroundColor: '#f0f0f0'},
  alertBox: {
    padding: 15,
    backgroundColor: '#f8d7da',
    marginVertical: 10,
    alignItems: 'flex-end',
    borderRadius: 5,
  },
  alertText1: {fontWeight: 'bold'},
  warningBox: {padding: 15, borderRadius: 5, backgroundColor: '#8F87F1'},
  warningText: {fontWeight: 'bold', textAlign: 'right'},
  btnText: {marginVertical: 7, backgroundColor: '#86A788'},
});

export default BasketScreen;
