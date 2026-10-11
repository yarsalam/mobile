import React from 'react';
import {View, StyleSheet} from 'react-native';
import GlobalText from './GlobalText';
import {useTheme} from '../context/MainContext';

interface FormCardProps {
  title?: string;
  children: React.ReactNode;
  style?: object;
  titleStyle?: object;
}

const FormCard: React.FC<FormCardProps> = ({
  title,
  children,
  style,
  titleStyle,
}) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);

  return (
    <View
      style={[styles.card, {backgroundColor: theme.colors.background}, style]}>
      {title && (
        <GlobalText style={[styles.title, titleStyle]}>{title}</GlobalText>
      )}
      {children}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      color: theme.colors.text,
      paddingVertical: 12,
    },
  });

export default FormCard;
