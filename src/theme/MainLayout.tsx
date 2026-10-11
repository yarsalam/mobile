import React, {ReactNode} from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../components/Header';
import {useTheme} from '../context/MainContext';
import LinearGradient from 'react-native-linear-gradient';


interface LayoutProps {
  children: ReactNode;
}

// MainLayout.tsx
const MainLayout: React.FC<LayoutProps> = ({children}) => {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.backgroundGradient}
        style={StyleSheet.absoluteFill}
      />
      <Header />
      <View style={styles.content}>{children}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 7,
    paddingTop: 10,
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: '#38bdf8',
  },
});

export default MainLayout;
