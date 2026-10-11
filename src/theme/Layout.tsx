import React, {ReactNode} from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/MainContext';

interface LayoutProps {
  children: ReactNode;
}

// Layout.tsx
const Layout: React.FC<LayoutProps> = ({children}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.backgroundGradient}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 7,
    paddingTop: 10,
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: '#38bdf8',
    justifyContent: 'center',
  },
});

export default Layout;
