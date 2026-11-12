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
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const {
    feed,
    isLoading,
    handleLike,
    handleSuperLike,
    handlePass,
    handlePromotionImpression,
    handlePromotionClick,
    handleDismissPromotion,
  } = useFeed(30);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const currentIndexRef = useRef(0);
  const isInteractingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Keep the in-flight/successful promise so repeated scroll events do not
  // create duplicate requests. The Backend also enforces idempotency.
  const impressionRequestsRef = useRef(new Map<string, Promise<unknown>>());

  const ensurePromotionImpression = (promotionId: string) => {
    const current = impressionRequestsRef.current.get(promotionId);
    if (current) return current;

    const request = handlePromotionImpression(promotionId).catch(error => {
      impressionRequestsRef.current.delete(promotionId);
      throw error;
    });
    impressionRequestsRef.current.set(promotionId, request);
    return request;
  };

  const recordVisiblePromotion = (index: number) => {
    const item = feed[index];
    if (item?.type !== 'promotion' || !item.id) return;
    void ensurePromotionImpression(String(item.id)).catch(error => {
      if (__DEV__) {
        console.warn('[FeedSlider] promotion impression failed', error);
      }
    });
  };

  const getVisibleIndex = (offsetX: number) =>
    Math.max(0, Math.min(feed.length - 1, Math.round(offsetX / SNAP)));

  const handleScroll = (event: any) => {
    const index = getVisibleIndex(event.nativeEvent.contentOffset.x);
    currentIndexRef.current = index;
    recordVisiblePromotion(index);
  };

  const handlePromotionPress = async (item: any) => {
    const promotionId = String(item.id);
    try {
      // The Backend rejects click events until the real impression is stored.
      await ensurePromotionImpression(promotionId);
      await handlePromotionClick(promotionId);
    } catch (error) {
      if (__DEV__) {
        console.warn('[FeedSlider] promotion click tracking failed', error);
      }
    }

    if (item.data?.variant === 'profile') {
      navigation.navigate('EditUserProfile');
      return;
    }

    // "Payment" and "EditProfile" were not registered stack routes. Use the
    // real product catalog and carry the exposure ID into the wallet checkout.
    navigation.navigate('Products', {
      promotionId,
      promotionVariant: item.data?.variant,
    });
  };

  const handlePromotionDismiss = async (promotionId: string) => {
    try {
      await ensurePromotionImpression(promotionId);
      await handleDismissPromotion(promotionId);
    } catch (error) {
      if (__DEV__) {
        console.warn('[FeedSlider] promotion dismiss failed', error);
      }
    }
  };

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

  useEffect(() => {
    if (!feed.length) {
      currentIndexRef.current = 0;
      return;
    }
    const index = Math.max(
      0,
      Math.min(feed.length - 1, currentIndexRef.current),
    );
    currentIndexRef.current = index;
    recordVisiblePromotion(index);
  }, [feed]);

  const handleScrollBeginDrag = () => {
    isInteractingRef.current = true;
  };

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = getVisibleIndex(event.nativeEvent.contentOffset.x);
    currentIndexRef.current = newIndex;
    isInteractingRef.current = false;
    recordVisiblePromotion(newIndex);
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
  }, [registerStep, startTour]);

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
          scrollEventThrottle={100}
          onLayout={() => recordVisiblePromotion(currentIndexRef.current)}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={{
            flexDirection: 'row',
            paddingHorizontal: (width - (CARD_WIDTH + 30)) / 2 - CARD_MARGIN,
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
                onPress={() => void handlePromotionPress(item)}
                onDismiss={() => void handlePromotionDismiss(String(item.id))}
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
