import React from 'react';
import {View, StyleSheet} from 'react-native';
import GlobalText from './GlobalText';

interface ProgressBarProps {
  progress: number; // درصد پیشرفت (۰ تا ۱۰۰)
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, {width: `${progress}%`}]} />
      </View>
      <GlobalText style={styles.progressText}>
        {progress}% تکمیل شده
      </GlobalText>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {marginVertical: 2},
  progressBar: {
    height: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
  },
  progressFill: {
    height: 5,
    backgroundColor: '#10b981',
    borderRadius: 999,
  },
  progressText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#fff',
  },
});

export default ProgressBar;
