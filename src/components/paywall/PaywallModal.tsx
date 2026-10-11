import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import GlobalText from '../GlobalText';
import {PaywallActionButton} from './PaywallActionButton';

export const PaywallModal = ({data, onClose}) => {
  if (!data) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <GlobalText style={styles.title}>{data.title}</GlobalText>
          <GlobalText style={styles.desc}>{data.description}</GlobalText>

          <PaywallActionButton action={data.primaryAction} primary />

          {data.secondaryAction && (
            <PaywallActionButton action={data.secondaryAction} primary />
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
