import React, {useEffect, useRef} from 'react';
import {View, ScrollView, Dimensions, StyleSheet} from 'react-native';
import UserCard, {CARD_WIDTH} from './UserCard';
import PromotionCard from '../PromotionCard';
import {useFeed} from '../../api/intractions/mutations/intractionsMutation';
import {useNavigation} from '@react-navigation/native';
import LoadingWrapper from '../LoadingWrapper';
import {useHintTour} from '../hints/HintTourContext';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types/rootStackParamList';

const {width} = Dimensions.get('window');
const CARD_MARGIN = 12;
const SNAP = CARD_WIDTH + CARD_MARGIN * 2;
const AUTO_SLIDE_INTERVAL = 6500;

const FeedSlider = () => {
  const scrollRef = useRef<ScrollView>(null);
  const {feed, isLoading, handleLike, handleSuperLike, handlePass} =
    useFeed(30);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ── اسلاید خودکار ──
  const currentIndexRef = useRef(0);
  const isInteractingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    stopAutoSlide();
    if (feed.length <= 1) return;

    timerRef.current = setInterval(() => {
      if (isInteractingRef.current) return;

      const nextIndex = (currentIndexRef.current + 1) % feed.length;
      currentIndexRef.current = nextIndex;

      scrollRef.current?.scrollTo({
        x: nextIndex * SNAP,
        animated: true,
      });
    }, AUTO_SLIDE_INTERVAL);

    return stopAutoSlide;
  }, [feed.length]);

  const handleScrollBeginDrag = () => {
    isInteractingRef.current = true;
  };

  const handleMomentumScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SNAP);
    currentIndexRef.current = newIndex;
    isInteractingRef.current = false;
  };
  // ────────────────────

  const handlePromotionPress = (item: any) => {
    const navigationTarget = item.data.navigationTarget || 'Products';
    const navigationParams = item.data.navigationParams || {
      type: item.data.variant,
    };
    navigation.navigate(navigationTarget as any, navigationParams);
  };

  const likeButtonRef = useRef(null);
  const passButtonRef = useRef(null);
  const {registerStep, startTour} = useHintTour();

  useEffect(() => {
    registerStep({
      id: 'like',
      targetRef: likeButtonRef,
      text: 'از این دکمه برای لایک کردن کاربر استفاده کنید',
    });
    registerStep({
      id: 'pass',
      targetRef: passButtonRef,
      text: 'از این دکمه برای رد کردن کاربر استفاده کنید',
    });
    startTour();
  }, []);

  return (
    <View style={styles.container}>
      <LoadingWrapper
        isLoading={isLoading}
        hasData={feed.length > 0}
        skeletonType="feed">
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP}
          decelerationRate="fast"
          snapToAlignment="center"
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={{
            flexDirection: 'row',
            paddingHorizontal: (width - (CARD_WIDTH+30)) / 2 - CARD_MARGIN,
          }}>
          {feed.map((item: any) =>
            item.type === 'user' ? (
              <UserCard
                key={String(item.id)}
                refLikeButton={likeButtonRef}
                refPassButton={passButtonRef}
                user={item.data}
                priority={item.priority}
                onLike={() => handleLike(item.data.id)}
                onSuperLike={() => handleSuperLike(item.data.id)}
                onPass={() => handlePass(item.data.id)}
                onProfilePress={() =>
                  navigation.navigate('UserProfile', {user: item.data.id})
                }
                isFirst={item.priority >= 100}
              />
            ) : (
              <PromotionCard
                key={String(item.id)}
                data={item.data}
                onPress={() => handlePromotionPress(item)}
              />
            ),
          )}
        </ScrollView>
      </LoadingWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FeedSlider;
