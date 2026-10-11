import React, {useRef} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import GlobalText from '../GlobalText';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../context/MainContext';
import {getUserAvatarSource} from '../../utils/imageUtils';
import LoadingWrapper from '../LoadingWrapper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';

interface NewUser {
  id: number;
  nickname: string;
  avatar?: string | null;
  gender: string;
}

interface NewUsersStoriesProps {
  users: NewUser[];
  isLoading: boolean;
}

const NewUsersStories: React.FC<NewUsersStoriesProps> = ({
  users = [],
  isLoading,
}) => {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scrollRef = useRef<ScrollView>(null);

  // ← هیچ تایمری نیست، کاربر خودش اسکرول می‌کند

  return (
    <View>
      <LoadingWrapper
        isLoading={isLoading}
        hasData={users.length > 0}
        skeletonType="newUsers"
        skeletonCount={5}
        emptyComponent={
          <GlobalText style={{textAlign: 'center'}}>
            کاربر جدیدی نیست
          </GlobalText>
        }>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 8}}>
          {users.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.storyItem}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('UserProfile', {user: item.id})
              }>
              <LinearGradient
                colors={['#F58529', '#DD2A7B', '#8134AF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.gradientBorder}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={getUserAvatarSource({
                      avatarUrl: item.avatar ?? null,
                      gender: item.gender,
                    })}
                    style={styles.avatar}
                  />
                </View>
              </LinearGradient>
              <GlobalText style={styles.name} numberOfLines={1}>
                {item.nickname}
              </GlobalText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LoadingWrapper>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    storyItem: {
      alignItems: 'center',
      marginRight: 14,
      width: 74,
    },
    gradientBorder: {
      width: 74,
      height: 74,
      borderRadius: 37,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    avatarWrapper: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {width: 64, height: 64, borderRadius: 32},
    name: {
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 10,
      width: 74,
    },
  });

export default NewUsersStories;
