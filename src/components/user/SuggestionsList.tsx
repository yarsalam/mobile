import React from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import GlobalText from '../GlobalText';
import {useTheme} from '../../context/MainContext';
import {useAuth} from '../../context/AuthContext';
import {getUserAvatarSource} from '../../utils/imageUtils';
import LoadingWrapper from '../LoadingWrapper';
import {useNavigation} from '@react-navigation/native';
import {useSuggestionsList} from '../../api/mutations/useSuggestionsList';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';
import {useLikeMutation} from '../../api/intractions/mutations/useLikeMutation';
import {useSuperLikeMutation} from '../../api/intractions/mutations/useSuperLikeMutation';
import {usePassMutation} from '../../api/intractions/mutations/usePassMutation';
import {useQueryClient} from '@tanstack/react-query';
import EmptyState from '../EmptyState';

interface Suggestion {
  id: number;
  nickname: string;
  age: number;
  avatar: string | null;
  city?: string;
  gender?: string;
}

const SuggestionsList: React.FC = () => {
  const {theme} = useTheme();
  const styles = getStyles(theme);
  const {user} = useAuth();
  const userId = user?.id;

  // دریافت پیشنهادات از API
  const {data: suggestions = [], isLoading} = useSuggestionsList(userId, 10);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  const likeMutation = useLikeMutation();
  const superLikeMutation = useSuperLikeMutation();
  const passMutation = usePassMutation(() => {
    queryClient.invalidateQueries({queryKey: ['suggestions', userId, 10]});
  });

  // دیگر نیازی به useMutation مستقیم نیست
  const handleLike = (id: number) => likeMutation.mutate(id);
  const handleSuperLike = (id: number) => superLikeMutation.mutate(id);
  const handlePass = (id: number) => passMutation.mutate(id);

  // EmptyState با تبلیغ Boost
  const emptyComponent = (
    <View style={{marginTop: 5, alignItems: 'center'}}>
      <EmptyState
        icon="🧠"
        title="پیشنهاد هوشمند فعال نیست"
        description="هنوز تعامل کافی نداشتی تا هوش مصنوعی ما بتونه بهترین‌ها رو برات پیدا کنه."
        highlight="پروفایلت رو تکمیل کن ➕ Boost رایگان بگیر"
        actionText="تکمیل پروفایل"
        onAction={() => navigation.navigate('EditUserProfile')}
      />
    </View>
  );

  const renderCard = ({item}: {item: Suggestion}) => {
    const avatarSource = getUserAvatarSource({
      avatarUrl: item.avatar,
      gender: item.gender,
    });
    const ageText = item.age && item.age > 0 ? `، ${item.age}` : '';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('UserProfile', {userId: item.id})}
        style={styles.card}>
        <Image source={avatarSource} style={styles.avatar} />
        <GlobalText style={styles.name}>
          {item.nickname}
          {ageText}
        </GlobalText>
        {item.city && <GlobalText style={styles.city}>{item.city}</GlobalText>}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, {borderColor: '#F87171'}]}
            onPress={() => handleLike(item.id)}>
            <GlobalText style={styles.btnText}>❤️</GlobalText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, {borderColor: '#FBBF24'}]}
            onPress={() => handleSuperLike(item.id)}>
            <GlobalText style={styles.btnText}>⭐</GlobalText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, {borderColor: '#60A5FA'}]}
            onPress={() => handlePass(item.id)}>
            <GlobalText style={styles.btnText}>❌</GlobalText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <LoadingWrapper
        isLoading={isLoading}
        hasData={suggestions.length > 0}
        skeletonType="suggestions"
        skeletonCount={3}
        emptyComponent={emptyComponent}>
        <FlatList
          data={suggestions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{paddingHorizontal: 10}}
        />
      </LoadingWrapper>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      paddingVertical: 25,
      borderWidth: 0.2,
      borderColor: theme.colors.border,
      borderRadius: 5,
    },
    card: {
      width: 130,
      marginRight: 15,
      padding: 12,
      borderRadius: 10,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: {width: 0, height: 4},
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    name: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    city: {
      fontSize: 12,
      color: theme.colors.text,
      marginBottom: 10,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    btn: {
      width: 24,
      height: 24,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
      borderWidth: 1,
      backgroundColor: '#312e2effff',
    },
    btnText: {
      fontSize: 16,
      color: '#fff',
    },
  });

export default SuggestionsList;
