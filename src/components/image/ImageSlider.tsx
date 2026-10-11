import React, {useRef, useState} from 'react';
import {
  Modal,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const ImageSlider = ({
  visible,
  images,
  initialIndex,
  onClose,
}: {
  visible: boolean;
  images: {url: string}[];
  initialIndex: number;
  onClose: () => void;
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < images.length) {
      flatListRef.current?.scrollToIndex({index, animated: true});
      setCurrentIndex(index);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{flex: 1, backgroundColor: 'black'}}>
        {/* دکمه بستن */}
        <TouchableOpacity
          onPress={onClose}
          style={{position: 'absolute', top: 40, right: 20, zIndex: 2}}>
          <Image
            source={require('../../assets/img/close.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>

        {/* دکمه عقب */}
        <TouchableOpacity
          onPress={() => scrollToIndex(currentIndex - 1)}
          style={{
            position: 'absolute',
            left: 10,
            top: height / 2 - 30,
            zIndex: 2,
            padding: 10,
          }}>
          <Image
            source={require('../../assets/img/arrow-back.png')}
            style={{width: 24, height: 24, tintColor: 'white'}}
          />
        </TouchableOpacity>

        {/* دکمه جلو */}
        <TouchableOpacity
          onPress={() => scrollToIndex(currentIndex + 1)}
          style={{
            position: 'absolute',
            right: 10,
            top: height / 2 - 30,
            zIndex: 2,
            padding: 10,
          }}>
          <Image
            source={require('../../assets/img/arrow-right.png')}
            style={{width: 24, height: 24, tintColor: 'white'}}
          />
        </TouchableOpacity>

        {/* لیست تصاویر */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          initialScrollIndex={initialIndex}
          keyExtractor={(_, i) => i.toString()}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={e => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          renderItem={({item}) => (
            <View
              style={{
                width,
                height,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: item.url}}
                style={{
                  width: width,
                  height: height * 0.85,
                  resizeMode: 'contain',
                }}
              />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

export default ImageSlider;
