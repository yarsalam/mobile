import {StyleSheet, TouchableOpacity, View} from 'react-native';
import GlobalText from './GlobalText';
import {useTheme} from '../context/MainContext';

interface EmptyStateProps {
  icon: string;
  title?: string;
  description?: string;
  highlight?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  highlight,
  actionText,
  onAction,
}) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      <GlobalText style={styles.icon}>{icon}</GlobalText>

      <GlobalText style={styles.title}>{title}</GlobalText>

      {highlight && (
        <View style={styles.highlightBox}>
          <GlobalText style={styles.highlightText}>{highlight}</GlobalText>
        </View>
      )}

      <GlobalText style={styles.description}>{description}</GlobalText>

      <TouchableOpacity onPress={onAction} style={styles.button}>
        <GlobalText style={styles.buttonText}>{actionText}</GlobalText>
      </TouchableOpacity>
    </View>
  );
};
const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      marginVertical: 10,
      borderWidth: 0.4,
      borderColor: theme.colors.border,
    },
    icon: {
      fontSize: 42,
      marginBottom: 10,
    },
    title: {
      fontSize: 17,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 6,
    },
    description: {
      textAlign: 'center',
      color: theme.colors.text,
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 16,
    },
    highlightBox: {
      backgroundColor: '#1f2937',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginBottom: 10,
    },
    highlightText: {
      color: '#80d0b2ff',
      fontSize: 15,
    },
    button: {
      backgroundColor: '#10B981',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 30,
    },
    buttonText: {
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default EmptyState;
