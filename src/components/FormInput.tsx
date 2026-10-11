import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker, {ListModeType} from 'react-native-dropdown-picker';
import {useTheme} from '../context/MainContext';
import GlobalText from './GlobalText';

interface FormInputProps {
  label?: string;
  type: 'text' | 'dropdown' | 'textarea' | 'radiobutton';
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
  dropdownItems?: {label: string; value: string}[];
  radioItems?: {label: string; value: string}[];
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  zIndex?: number;
  disabled?: boolean;
  listMode?: ListModeType;
  style?: object;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder = '',
  dropdownItems = [],
  radioItems = [],
  keyboardType,
  secureTextEntry,
  zIndex,
  listMode = 'MODAL',
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(dropdownItems);
  const {theme} = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}:</Text>}

      {type === 'text' && (
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor={theme.colors.text}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
      )}

      {type === 'dropdown' && (
        <DropDownPicker
          open={open}
          value={value ?? null}
          items={items}
          setOpen={setOpen}
          zIndex={zIndex}
          zIndexInverse={10000}
          setValue={callback => {
            const selectedValue =
              typeof callback === 'function' ? callback(value) : callback;
            onChange(selectedValue);
          }}
          setItems={setItems}
          placeholder={placeholder}
          listMode={listMode}
          style={[
            styles.dropdown,
            {backgroundColor: theme.colors.background}, // 👈 بک‌گراند اصلی
          ]}
          placeholderStyle={styles.placeholderStyle}
          dropDownContainerStyle={[
            styles.dropdownContainer,
            {backgroundColor: theme.colors.background}, // 👈 بک‌گراند لیست
          ]}
          modalProps={{
            animationType: 'slide',
            transparent: true,
            presentationStyle: 'overFullScreen',
          }}
          modalContentContainerStyle={{
            backgroundColor: theme.colors.textBackground,
            marginHorizontal: 10,
            marginVertical: 'auto', // 👈 باعث میشه کل صفحه پر نشه
            borderRadius: 5,
            maxHeight: 400,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}
          searchContainerStyle={{
            borderBottomColor: theme.colors.border,
          }}
          CloseIconComponent={() => (
            <GlobalText style={{color: theme.colors.text, fontSize: 22}}>
              ✕
            </GlobalText>
          )}
          listItemLabelStyle={styles.itemLabel}
          textStyle={styles.textStyle}
          TickIconComponent={() => (
            <GlobalText style={{color: 'rgba(24, 255, 24, 1)', fontSize: 14}}>
              ✔
            </GlobalText>
          )}
          ArrowDownIconComponent={() => (
            <GlobalText style={{color: theme.colors.arrowColor, fontSize: 12}}>
              ▼
            </GlobalText>
          )}
          ArrowUpIconComponent={() => (
            <GlobalText style={{color: theme.colors.arrowColor, fontSize: 12}}>
              ▲
            </GlobalText>
          )}
        />
      )}

      {type === 'textarea' && (
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          style={[styles.input, styles.textarea]}
          placeholderTextColor={theme.colors.text}
          multiline
          numberOfLines={3}
          keyboardType={keyboardType}
        />
      )}

      {type === 'radiobutton' && radioItems && (
        <View style={{marginTop: 10}}>
          {radioItems.map(item => (
            <TouchableOpacity
              key={item.value}
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                marginVertical: 6,
              }}
              onPress={() => onChange(item.value)}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: theme.colors.text,
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {value === item.value && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: theme.colors.text,
                    }}
                  />
                )}
              </View>

              <GlobalText style={{color: theme.colors.text}}>
                {item.label}
              </GlobalText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    textStyle: {
      textAlign: 'right',
      flex: 1,
      fontFamily: theme.fonts.primary,
      color: theme.colors.text,
    },
    container: {
      marginBottom: 15,
      width: '100%',
      zIndex: 10,
      paddingHorizontal: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: theme.colors.text,
      textAlign: 'right',
      fontFamily: theme.fonts.primary,
    },
    input: {
      height: 50,
      width: '100%',
      backgroundColor: theme.colors.background,
      borderRadius: 5,
      paddingHorizontal: 10,
      borderWidth: 0.6,
      borderColor: theme.colors.border,
      color: theme.colors.text,
      textAlign: 'right',
      marginVertical: 6,
    },
    textarea: {
      height: 100,
      textAlignVertical: 'top',
      paddingVertical: 10,
      fontFamily: theme.fonts.primary,
      borderWidth: 0.6,
      borderColor: theme.colors.border,
      color: theme.colors.text,
    },
    dropdown: {
      borderColor: theme.colors.border,
      borderWidth: 0.6,
      borderRadius: 5,
      zIndex: 200,
      flexDirection: 'row-reverse',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    dropdownContainer: {
      borderColor: theme.colors.border,
      borderWidth: 0.2,
      borderRadius: 5,
    },
    itemLabel: {
      textAlign: 'right',
      writingDirection: 'rtl',
      color: theme.colors.text,
    },
    placeholderStyle: {
      textAlign: 'right',
      writingDirection: 'rtl',
      fontFamily: theme.fonts.primary,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
  });

export default FormInput;
