import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import GlobalText from '../GlobalText';
import {PaywallActionButton} from './PaywallActionButton';
import type {PaywallResponse} from '../../../types/paywall';

interface Props {
  data: PaywallResponse | null;
  onClose: () => void;
}

export const PaywallModal = ({data, onClose}: Props) => {
  if (!data) return null;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <GlobalText style={styles.title}>{data.title}</GlobalText>
          <GlobalText style={styles.desc}>{data.description}</GlobalText>
          <PaywallActionButton action={data.primaryAction} primary />
          {data.secondaryAction && (
            <PaywallActionButton action={data.secondaryAction} />
          )}
          <TouchableOpacity onPress={onClose}>
            <GlobalText style={styles.later}>بعداً</GlobalText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {},
  later: {},
  desc: {},
  card: {},
  overlay: {},
});
