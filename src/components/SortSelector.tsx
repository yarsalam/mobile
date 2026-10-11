import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import {useTheme} from '../context/MainContext';

interface Option {
  label: string;
  value: string;
}

interface Props {
  iconSource: any; // منبع تصویر (مثلاً icons.favoriets)
  iconActiveColor?: string; // رنگ آیکون فعال
  active?: boolean; // آیا آیکون فعال است؟
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  title: string;
  buttonLabel: string;
}

const SortSelector: React.FC<Props> = ({
  iconSource,
  options,
  selectedValue,
  onSelect,
  title,
  buttonLabel,
}) => {
  const [visible, setVisible] = useState(false);
  const selectedLabel =
    options.find(o => o.value === selectedValue)?.label || '';
  const {theme} = useTheme();
  const styles = getStyles(theme);

  return (
    <>
      {/* دکمه بازکننده */}
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={{color: theme.colors.text}}>
          {selectedLabel || buttonLabel}
        </Text>
        <Image source={iconSource} style={[styles.icon]} />
      </TouchableOpacity>
      <View style={styles.buttonLine} />
      {/* دراور */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View
            style={[styles.sheet, {backgroundColor: theme.colors.background}]}>
            {/* هدر */}
            <View style={styles.header}>
              <Pressable onPress={() => setVisible(false)}>
                <Text style={[styles.close, {color: theme.colors.text}]}>
                  ×
                </Text>
              </Pressable>
              <Text style={[styles.title, {color: theme.colors.text}]}>
                {title}
              </Text>
            </View>

            {/* لیست گزینه‌ها */}
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({item}) => (
                <Pressable
                  style={styles.item}
                  onPress={() => {
                    onSelect(item.value);
                    setVisible(false);
                  }}>
                  {item.value === selectedValue && (
                    <Text style={[styles.itemTick, {color: theme.colors.text}]}>
                      ✓
                    </Text>
                  )}
                  <Text style={[styles.itemText, {color: theme.colors.text}]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
              contentContainerStyle={{paddingBottom: 24}}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    itemTick: {
      fontSize: 18,
      textAlign: 'left',
    },
    buttonLine: {
      height: 0.8,
      backgroundColor: theme.colors.border,
      marginTop: 18,
      width: '100%',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: theme.colors.border,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 20,
      alignSelf: 'flex-end',
    },
    icon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      marginLeft: 8,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '90%',
      paddingHorizontal: 15,
      paddingTop: 16,
      paddingBottom: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    close: {
      fontSize: 24,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 14,
      alignItems: 'center',
    },
    itemText: {
      textAlign: 'right',
      flex: 1,
    },
    separator: {
      height: 0.5,
      backgroundColor: theme.colors.border,
    },
  });

export default SortSelector;
