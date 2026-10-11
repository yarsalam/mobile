import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {useTheme} from '../../context/MainContext';
import GlobalText from '../../components/GlobalText';
import CustomButton from '../../components/CustomButtonProps';
import {
  locationOption,
  educationOptions,
  religionOptions,
  healthOptions,
} from '../../utils/data';

interface SubFilterDrawerProps {
  categoryKey: string;
  currentValue: any;
  onSave: (value: any) => void;
  onClose: () => void;
  filterType: 'list' | 'range';
}

/** ردیف انتخاب با استایل رادیو باتن (به جای تیک) */
const RadioRow: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
}> = ({label, selected, onPress}) => {
  const {theme} = useTheme();
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <GlobalText>{label}</GlobalText>
      <View
        style={[
          styles.radioOuter,
          {borderColor: theme.colors.border || '#ccc'},
        ]}>
        {selected && (
          <View
            style={[styles.radioInner, {backgroundColor: theme.colors.primary}]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

/** استان و شهر — به‌عنوان کامپوننت جدا تا Hooks بدون مشکل کار کنند */
const LocationOptions: React.FC<{
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<any>>;
}> = ({selected, setSelected}) => {
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(
    (selected || []).filter((s: string) =>
      locationOption.some(p => p.province === s),
    ),
  );

  // اگر مقدار از بیرون عوض شد (مثلاً هنگام باز شدن دوباره درور) sync کن
  useEffect(() => {
    setSelectedProvinces(
      (selected || []).filter((s: string) =>
        locationOption.some(p => p.province === s),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSelection = (newProvinces: string[]) => {
    setSelectedProvinces(newProvinces);
    const citiesToKeep = (selected || []).filter(
      (s: string) =>
        locationOption.find(p => p.province === s) ||
        locationOption.some(
          p => newProvinces.includes(p.province) && p.cities.includes(s),
        ),
    );
    setSelected([...new Set([...newProvinces, ...citiesToKeep])]);
  };

  const toggleProvince = (prov: string) => {
    if (selectedProvinces.includes(prov)) {
      updateSelection(selectedProvinces.filter(p => p !== prov));
    } else {
      updateSelection([...selectedProvinces, prov]);
    }
  };

  const toggleCity = (city: string) => {
    setSelected((prev: string[]) =>
      prev.includes(city) ? prev.filter(v => v !== city) : [...prev, city],
    );
  };

  const showCities = selectedProvinces.length > 0;
  const cityOptions = selectedProvinces.flatMap(
    prov => locationOption.find(p => p.province === prov)?.cities || [],
  );

  return (
    <View style={{flex: 1, alignItems: 'flex-end'}}>
      <GlobalText style={styles.subTitle}>استان</GlobalText>
      <ScrollView style={styles.subScroll}>
        {locationOption.map(provObj => (
          <RadioRow
            key={provObj.province}
            label={provObj.province}
            selected={selectedProvinces.includes(provObj.province)}
            onPress={() => toggleProvince(provObj.province)}
          />
        ))}
      </ScrollView>

      {showCities && (
        <>
          <GlobalText style={styles.subTitle}>شهر</GlobalText>
          <ScrollView style={styles.subScroll}>
            {cityOptions.map(city => (
              <RadioRow
                key={city}
                label={city}
                selected={selected.includes(city)}
                onPress={() => toggleCity(city)}
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

/** بازه عددی (سن/وزن/قد) — کنترل‌شده مستقیم از selected، بدون state تکراری */
const RangeOptions: React.FC<{selected: any; setSelected: any}> = ({
  selected,
  setSelected,
}) => (
  <View>
    <View style={styles.rangeRow}>
      <GlobalText>از</GlobalText>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={selected?.min ?? ''}
        onChangeText={v => setSelected((prev: any) => ({...prev, min: v}))}
      />
    </View>
    <View style={styles.rangeRow}>
      <GlobalText>تا</GlobalText>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={selected?.max ?? ''}
        onChangeText={v => setSelected((prev: any) => ({...prev, max: v}))}
      />
    </View>
  </View>
);

const SubFilterDrawer: React.FC<SubFilterDrawerProps> = ({
  categoryKey,
  currentValue,
  onSave,
  onClose,
  filterType,
}) => {
  const {theme} = useTheme();
  const [selected, setSelected] = useState<any>(
    currentValue || (filterType === 'range' ? {} : []),
  );

  useEffect(() => {
    setSelected(currentValue || (filterType === 'range' ? {} : []));
  }, [currentValue, filterType]);

  const toggleSelect = (val: string) => {
    setSelected((prev: string[]) =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val],
    );
  };

  const renderListOptions = (options: string[]) => (
    <ScrollView style={{flex: 1}}>
      {options.map(opt => (
        <RadioRow
          key={opt}
          label={opt}
          selected={selected.includes(opt)}
          onPress={() => toggleSelect(opt)}
        />
      ))}
    </ScrollView>
  );

  const handleSave = () => {
    if (filterType === 'range') {
      onSave({min: selected.min || '', max: selected.max || ''});
    } else {
      onSave(selected);
    }
  };

  const categoryTitle = (() => {
    switch (categoryKey) {
      case 'city':
        return 'شهر و استان';
      case 'education':
        return 'تحصیلات';
      case 'religion':
        return 'مذهب';
      case 'health':
        return 'سلامت';
      case 'hasPhoto':
        return 'عکس دار';
      case 'age':
        return 'سن';
      case 'weight':
        return 'وزن';
      case 'height':
        return 'قد';
      default:
        return '';
    }
  })();

  const getOptions = () => {
    switch (categoryKey) {
      case 'education':
        return educationOptions;
      case 'religion':
        return religionOptions;
      case 'health':
        return healthOptions;
      default:
        return [];
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <TouchableOpacity onPress={onClose} style={{alignSelf: 'flex-start'}}>
        <GlobalText>✖</GlobalText>
      </TouchableOpacity>
      <GlobalText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10,alignSelf:'flex-end'}}>
        {categoryTitle}
      </GlobalText>

      {/* بخش محتوا: flex:1 تا فضای باقی‌مانده رو بگیره ولی دکمه ذخیره رو بیرون نندازه */}
      <View style={{flex: 1}}>
        {categoryKey === 'city' && (
          <LocationOptions selected={selected} setSelected={setSelected} />
        )}

        {['education', 'religion', 'health'].includes(categoryKey) &&
          renderListOptions(getOptions())}

        {categoryKey === 'hasPhoto' && (
          <RadioRow
            label="دارای عکس"
            selected={!!selected}
            onPress={() => setSelected((prev: boolean) => !prev)}
          />
        )}

        {['age', 'weight', 'height'].includes(categoryKey) && (
          <RangeOptions selected={selected} setSelected={setSelected} />
        )}
      </View>

      {/* دکمه ذخیره — همیشه ثابت پایین، بیرون از اسکرول */}
      <CustomButton
        label="ذخیره"
        onPress={handleSave}
        gradient
        style={{marginTop: 12}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  option: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    gap: 7,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 1,
  },
  subScroll: {maxHeight: 200},
  subTitle: {fontSize: 16, fontWeight: 'bold', marginTop: 16},
  rangeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: '80%',
    marginRight: 20,
  },
});

export default SubFilterDrawer;
