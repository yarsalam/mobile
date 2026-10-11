import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useTransactions} from '../api/mutations/transactions/useTransactions';
import GlobalText from './GlobalText';
import {useTheme} from '../context/MainContext';

export default function TransactionList() {
  const {data, isLoading} = useTransactions();

  const {theme} = useTheme();
  const styles = getStyles(theme);
  const color = theme.colors.text;

  if (isLoading) return <Text>در حال بارگذاری...</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.trackingCode}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => (
          <View style={styles.item}>
            <GlobalText style={{color: color}}>
              محصول: {item.product}
            </GlobalText>
            <GlobalText style={{color: color}}>
              مبلغ: {item.amount.toLocaleString()} تومان
            </GlobalText>
            <GlobalText style={{color: color}}>
              نوع پرداخت: {item.paymentType}
            </GlobalText>
            <GlobalText style={{color: color}}>
              تاریخ: {item.paymentDate}
            </GlobalText>
            <GlobalText style={{color: color}}>
              وضعیت: {item.status === 'success' ? 'موفق' : 'ناموفق'}
            </GlobalText>
          </View>
        )}
      />
    </View>
  );
}

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 10,
    },
    listContent: {
      paddingBottom: 20,
    },
    item: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      alignSelf: 'stretch',
      alignItems: 'flex-end',
      writingDirection: 'rtl',
    },
  });
