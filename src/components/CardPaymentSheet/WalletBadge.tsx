import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import GlobalText from '../GlobalText';
import {useTheme} from '../../context/MainContext';
import {useWallet} from '../../api/queries/useWallet';
import {useNavigation} from '@react-navigation/native';

/**
 * WalletBadge — نمایش موجودی در header
 * کلیک → صفحه Products (فروشگاه)
 */
export default function WalletBadge() {
  const {theme} = useTheme();
  const {data: wallet, isLoading} = useWallet();
  const navigation = useNavigation();

  if (isLoading || !wallet) return null;

  const toman = Math.floor(wallet.balance / 10);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Products' as never)}
      style={[styles.badge, {backgroundColor: theme.colors.primary + '20'}]}>
      <GlobalText style={[styles.text, {color: theme.colors.primary}]}>
        💰 {toman.toLocaleString('fa-IR')} T
      </GlobalText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4},
  text: {fontSize: 13, fontWeight: 'bold'},
});
