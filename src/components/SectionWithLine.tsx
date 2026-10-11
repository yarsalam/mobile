import React from 'react';
import {View, StyleSheet} from 'react-native';
import GlobalText from './GlobalText';
import {useTheme} from '../context/MainContext';

interface SectionWithLineProps {
  text: string;
  bgColor?: string;
  my?: number;
  textColor?: string;
  fontFamily?: string; // ← اضافه شده
  fontSize?: number;
}

const SectionWithLine: React.FC<SectionWithLineProps> = ({
  text,
  bgColor = '#5eead4',
  my = 20,
  textColor = '#1F2937',
  fontFamily,
  fontSize = 16,
}) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.container, {marginVertical: my}]}>
      <View style={styles.line} />

      <GlobalText
        fontFamily={fontFamily}
        numberOfLines={2} // 👈 اجازه دو خط
        ellipsizeMode="clip"
        style={[
          styles.text,
          {
            backgroundColor: bgColor,
            color: textColor,
            fontSize,
          },
        ]}>
        {text}
      </GlobalText>

      <View style={styles.line} />
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border
    },
    text: {
      marginHorizontal: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontWeight: 'bold',
      fontSize: 16,
      borderRadius: 4,
      textAlign: 'center',
      flexShrink: 0, // 👈 خیلی مهم
      alignSelf: 'center', // 👈 کمک به اندازه‌گیری درست
    },
  });

export default SectionWithLine;
