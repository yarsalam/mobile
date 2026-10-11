import React from 'react';
import {Text, TextProps, StyleSheet} from 'react-native';
import {useTheme} from '../context/MainContext';

const GlobalText: React.FC<TextProps & {fontFamily?: string}> = ({
  style,
  fontFamily, // ← prop جدید اختیاری
  ...props
}) => {
  const {theme} = useTheme();

  return (
    <Text
      style={[
        {
          fontFamily: fontFamily || theme.fonts.primary, // اگر prop دادیم → استفاده کن، иначе تم
          color: theme.colors.text,
        },
        styles.text,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: '500',
    fontSize: 16,
  },
});

export default GlobalText;
