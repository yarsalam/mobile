import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

type Props = {
  previewUrls: string[];
  mainImage: string | null;
  onRemove: (index: number) => void;
  onSelect: (url: string) => void;
};

const ImagePickerGrid: React.FC<Props> = ({
  previewUrls,
  mainImage,
  onRemove,
  onSelect,
}) => {
  return (
    <View style={styles.grid}>
      {previewUrls.map((url, index) => (
        <View key={index} style={styles.item}>
          <Image source={{ uri: url }} style={styles.image} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(index)}
          >
            <Text style={styles.removeText}>حذف</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectButton,
              mainImage === url && styles.selected,
            ]}
            onPress={() => onSelect(url)}
          >
            <Text style={styles.selectText}>انتخاب اصلی</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  item: {
    width: 150,
    height: 130,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
  },
  removeButton: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: 'red',
    padding: 2,
    borderRadius: 4,
  },
  removeText: {
    color: '#fff',
    fontSize: 10,
  },
  selectButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'green',
    padding: 2,
    borderRadius: 4,
  },
  selectText: {
    color: '#fff',
    fontSize: 10,
  },
  selected: {
    backgroundColor: 'green',
  },
});

export default ImagePickerGrid;
