import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import GlobalText from './GlobalText';
import {useTheme} from '../context/MainContext';

type Tag = {
  label: string;
  emoji?: string;
};

type Props = {
  options: Tag[];
  selected?: string[]; // لیستی از label ها
  onChange: (selected: string[]) => void;
  maxSelection?: number;
};

const InterestSelector: React.FC<Props> = ({
  options,
  selected = [],
  onChange,
  maxSelection = 5,
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selected);
  const [customInterest, setCustomInterest] = useState('');
  const {theme} = useTheme();
   const styles = getStyles(theme);
  // همگام‌سازی اگر فرم مقدار رو بروز کنه
  useEffect(() => {
    setLocalSelected(selected || []);
  }, [selected]);

  const toggleSelect = (label: string) => {
    const exists = localSelected.includes(label);
    if (!exists && localSelected.length >= maxSelection) {
      // اگر توی این کامپوننت از useToast خواستی استفاده کنی، می‌تونی ارسال کنی.
      return;
    }
    const next = exists
      ? localSelected.filter(s => s !== label)
      : [...localSelected, label];
    setLocalSelected(next);
    onChange(next);
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) return;
    if (localSelected.includes(trimmed)) {
      setCustomInterest('');
      return;
    }
    if (localSelected.length >= maxSelection) {
      // اگر بخوای پیغام بدی از useToast استفاده کن (ولی این کامپوننت مستقله)
      setCustomInterest('');
      return;
    }
    const next = [...localSelected, trimmed];
    setLocalSelected(next);
    onChange(next);
    setCustomInterest('');
  };

  return (
    <View>
      <FlatList
        data={options}
        numColumns={3}
        keyExtractor={item => item.label}
        contentContainerStyle={{alignItems: 'flex-end'}}
        renderItem={({item}) => {
          const isSelected = localSelected.includes(item.label);
          return (
            <TouchableOpacity
              onPress={() => toggleSelect(item.label)}
              style={[
                styles.tag,
                {
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,
                  backgroundColor: isSelected
                    ? theme.colors.primary + '40'
                    : theme.colors.border,
                },
              ]}>
              <GlobalText style={styles.tagText}>
                {item.emoji ? `${item.emoji} ` : ''}
                {item.label}
              </GlobalText>
            </TouchableOpacity>
          );
        }}
      />

      {/* نمایش انتخاب شده‌ها به صورت چیپ با ایکون حذف */}
      <View style={styles.selectedRow}>
        {localSelected.map(s => (
          <View key={s} style={styles.selectedChip}>
            <GlobalText style={styles.selectedChipText}>{s}</GlobalText>
            <TouchableOpacity
              onPress={() => toggleSelect(s)}
              style={styles.removeBtn}>
              <GlobalText style={styles.removeBtnText}>✖</GlobalText>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* افزودن علاقه دلخواه */}
      <View style={styles.customContainer}>
        <TextInput
          style={[styles.customInput]}
          value={customInterest}
          onChangeText={setCustomInterest}
          placeholder="افزودن علاقه..."
          placeholderTextColor={'#fff'}
        />
        <TouchableOpacity onPress={addCustomInterest} style={styles.addButton}>
          <GlobalText style={{color: 'white', fontSize: 18}}>+</GlobalText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
  tag: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {fontSize: 14, textAlign: 'center'},

  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 11,
    justifyContent: 'flex-end',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    margin: 6,
    backgroundColor: '#009990',
    borderWidth: 0.8,
    borderColor: '#5fff82ff',
  },
  selectedChipText: {marginRight: 8},

  removeBtn: {paddingLeft: 6, paddingRight: 2},
  removeBtnText: {color: '#d3d2d2ff'},

  customContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 12,
  },
  customInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.textBackground,
    marginLeft: 10,
    borderWidth: 0.37,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default InterestSelector;
