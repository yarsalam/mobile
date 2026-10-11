import React from 'react';
import {Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {getUserAvatarSource} from '../../utils/imageUtils';

const Avatar = ({
  imageUrl,
  userGender,
}: {
  imageUrl?: string | null;
  userGender?: 'male' | 'female';
}) => {
  const source = getUserAvatarSource({
    avatarUrl: imageUrl,
    gender: userGender,
  });

  return (
    <LinearGradient
      colors={['#211C84', '#4D55CC', '#7A73D1']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.gradientBorder}>
      <Image source={source} style={styles.image} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBorder: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4, // ✅ فاصله بین border و عکس
  },
  image: {
    width: 208, // ✅ 220 - 2*padding
    height: 208,
    borderRadius: 106,
    borderWidth: 5,
    borderColor: '#fff',
  },
});

export default Avatar;