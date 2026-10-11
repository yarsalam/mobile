import React, {useState} from 'react';
import {Modal, View, Button, StyleSheet, TextInput} from 'react-native';
import {useTheme} from '../../context/MainContext';
import GlobalText from '../GlobalText';

const FilterModal = ({visible, onClose, onApply, currentFilters}) => {
  const [city, setCity] = useState(currentFilters.city || '');
  const [minAge, setMinAge] = useState(currentFilters.minAge || '');
  const [maxAge, setMaxAge] = useState(currentFilters.maxAge || '');
  const {theme} = useTheme();
  const styles = getStyles(theme);

  const handleApply = () => {
    onApply({city, minAge, maxAge});
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modal}>
        <GlobalText style={styles.title}>فیلترها</GlobalText>
        <TextInput
          placeholder="شهر"
          value={city}
          onChangeText={setCity}
          style={styles.input}
        />
        <TextInput
          placeholder="حداقل سن"
          keyboardType="numeric"
          value={minAge}
          onChangeText={setMinAge}
          style={styles.input}
        />
        <TextInput
          placeholder="حداکثر سن"
          keyboardType="numeric"
          value={maxAge}
          onChangeText={setMaxAge}
          style={styles.input}
        />
        <Button title="اعمال" onPress={handleApply} />
        <Button title="بستن" onPress={onClose} color="red" />
      </View>
    </Modal>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      borderColor: theme.colors.border,
      borderWidth: 1,
      marginVertical: 8,
      padding: 8,
      borderRadius: 5,
    },
  });

export default FilterModal;
