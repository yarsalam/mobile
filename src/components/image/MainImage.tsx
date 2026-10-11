import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

const defaultLogo = require('../../assets/img/logo.png'); // مقدار پیش‌فرض

interface MainImage {
    source?: ImageSourcePropType; // امکان ارسال تصویر دلخواه
    style?: object; // امکان ارسال استایل اضافه
}

const MainImage: React.FC<MainImage> = ({ source = defaultLogo, style }) => {
    return <Image source={source} style={[styles.logo, style]} />;
};

const styles = StyleSheet.create({
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 12,
        alignSelf: 'center',
    },
});

export default MainImage;
