import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlobalText from './GlobalText';
import { useTheme } from '../context/MainContext';

interface SectionTitleProps {
  text: string;
  my?: number; // فاصله عمودی
  textColor?: string;
  gradientColors?: string[]; // رنگ‌های گرادیانت
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  text,
  gradientColors = ['#3B82F6', '#9333EA'], // آبی به بنفش
}) => {
  const {theme} = useTheme();
  return (
    <View style={[styles.container, {marginTop: 20, marginBottom: 8}]}>
      <LinearGradient
        colors={gradientColors}
        style={styles.dot}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      />
      <GlobalText style={[styles.text, {color: theme.colors.text}]}>{text}</GlobalText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse', // دایره سمت راست متن
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 7,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // برای اندروید
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default SectionTitle;
