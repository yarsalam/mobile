import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../context/MainContext';
import GlobalText from './GlobalText';

const ThemePicker = () => {
  const {setThemeName, themeName, allThemes} = useTheme();

  return (
    <View style={styles.container}>
      <GlobalText style={styles.label}>انتخاب تم</GlobalText>
      <View style={styles.row}>
        {allThemes.map(theme => (
          <TouchableOpacity
            key={theme.name}
            onPress={() => setThemeName(theme.name)}
            style={[
              styles.circle,
              {backgroundColor: theme.backgroundGradient[2]},
              themeName === theme.name && styles.selected,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 10},
  label: {textAlign: 'center', marginBottom: 8},
  row: {flexDirection: 'row', justifyContent: 'center', gap: 16},
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
  },
  selected: {borderColor: '#FFD700', borderWidth: 3},
});

export default ThemePicker;
