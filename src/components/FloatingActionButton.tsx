import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native';
import GlobalText from './GlobalText';

interface FloatingActionButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: string;
  loading?: boolean; // ← اضافه شد
  text?: string; // ← اضافه شد
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  style,
  icon = '➕',
  loading = false,
  text = '',
}) => {
  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      activeOpacity={0.7}
      onPress={loading ? undefined : onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <View style={styles.row}>
          <GlobalText style={styles.icon}>{icon}</GlobalText>
          {text ? <GlobalText style={styles.text}>{text}</GlobalText> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    text: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6200ee',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    zIndex: 999,
  },
  icon: {
    fontSize: 26,
    color: '#fff',
  },
});

export default FloatingActionButton;
