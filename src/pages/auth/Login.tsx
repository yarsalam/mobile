import React, {useEffect, useRef} from 'react';
import {
  View,
  ImageSourcePropType,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';

import CustomButton from '../../components/CustomButtonProps';
import Layout from '../../theme/Layout';
import GlobalText from '../../components/GlobalText';
import {RootStackParamList} from '../../../types/rootStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Controller, useForm} from 'react-hook-form';
import {loginSchema} from '../../schemas/authSchemas';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import ToastHandler from '../../components/ToastHandler';
import {KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import {useTheme} from '../../context/MainContext';
import FormInput from '../../components/FormInput';
import {convertPersianNumbersToEnglish} from '../../utils/convertNumToEn';
import {useLoginMutation} from '../../api/auth/mutations/useLoginutation';
import MainImage from '../../components/image/MainImage';
import FormCard from '../../components/FormCard';

const admin_img = require('../../assets/img/admin.png');
const blog_img = require('../../assets/img/blog.png');
const rules_img = require('../../assets/img/rules.png');
const loves_img = require('../../assets/img/loves.png');

// تعریف نوع پراپرتی‌های کامپوننت
interface CircleButtonProps {
  imageSource: ImageSourcePropType;
  label: string;
  onPress: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  imageSource,
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity style={circleStyles.circleContainer} onPress={onPress}>
      {/* دایره با عکس در مرکز */}
      <View style={circleStyles.circle}>
        <Image source={imageSource} style={circleStyles.img} />
      </View>
      {/* متن زیر دایره */}
      <GlobalText style={circleStyles.label}>{label}</GlobalText>
    </TouchableOpacity>
  );
};

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
const Login: React.FC<LoginProps> = ({navigation}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop(); // ✅ cleanup
  }, [scaleAnim, opacityAnim]);

  const loginMutation = useLoginMutation();
  const {
    control,
    handleSubmit,
    formState: {errors, submitCount},
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const {theme} = useTheme();
  const styles = getStyles(theme);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    const sanitizedData = {
      ...data,
      phone: convertPersianNumbersToEnglish(data.phone),
    };

    loginMutation.mutate(sanitizedData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Layout>
          <ToastHandler errors={errors} submitCount={submitCount} />
          {/* 🔹 بخش اول: آیکون تماس با ما */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => console.log('تماس با ما')}>
              <Animated.View
                style={[
                  styles.pulseBorder,
                  {
                    transform: [{scale: scaleAnim}],
                    opacity: opacityAnim,
                  },
                ]}
              />
              <MainImage source={admin_img} style={styles.image} />
            </TouchableOpacity>
          </View>

          {/* 🔹 بخش دوم: فرم لاگین */}
          <FormCard
            title="ورود به یارسلام"
            style={{flex: 0.5, justifyContent: 'space-between'}}>
            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, value}}) => (
                <FormInput
                  placeholder="شماره موبایل"
                  keyboardType="phone-pad"
                  value={value}
                  onChange={onChange}
                  type="text"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({field: {onChange, value}}) => (
                <FormInput
                  type="text"
                  placeholder="رمز عبور"
                  secureTextEntry
                  value={value}
                  onChange={onChange}
                />
              )}
            />

            <View style={styles.options}>
              <GlobalText onPress={() => navigation.navigate('Register')}>
                ثبت نام
              </GlobalText>
              <GlobalText onPress={() => console.log('فراموشی رمز عبور')}>
                فراموشی رمز عبور
              </GlobalText>
            </View>

            {/* اینجا دکمه رو می‌ذاریم پایین */}
            <View>
              <CustomButton
                label={
                  loginMutation.isPending ? 'در حال ورود...' : 'ورود به یارسلام'
                }
                onPress={handleSubmit(onSubmit)}
                gradient
                loading={loginMutation.isPending}
              />
            </View>
          </FormCard>

          {/* 🔹 بخش سوم: لینک‌های وب‌ویو */}
          <View style={styles.footer}>
            <CircleButton
              imageSource={blog_img}
              label="وبلاگ"
              onPress={() =>
                navigation.navigate('WebViewScreen', {
                  url: 'https://yourwebsite.com/blog',
                })
              }
            />
            <CircleButton
              imageSource={rules_img}
              label="قوانین"
              onPress={() =>
                navigation.navigate('WebViewScreen', {
                  url: 'https://yourwebsite.com/rules',
                })
              }
            />
            <CircleButton
              imageSource={loves_img}
              label="ازدواج ها"
              onPress={() =>
                navigation.navigate('WebViewScreen', {
                  url: 'https://yourwebsite.com/marriage',
                })
              }
            />
          </View>
        </Layout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Login;

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    header: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },

    options: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 30,
    },
    footer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 5,
    },

    pulseBorder: {
      position: 'absolute',
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      alignSelf: 'center',
      marginLeft: 2, // نصف عرض
      marginTop: -4, // نصف ارتفاع
    },

    image: {
      width: 40,
      height: 40,
      borderRadius: 20,
      zIndex: 1,
    },
  });
const circleStyles = StyleSheet.create({
  circleContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#A6F1E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'green',
    elevation: 5,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 2,
    zIndex: 1,
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    color: 'white',
    fontFamily: 'IRANSans',
  },
});
