export type FeedItemType = 'user' | 'promotion';

export interface FeedUser {
  id: number;
  nickname: string;
  city?: string;
  age?: number;
  aboutme?: string;
  hobbies_self?: string[];
  values_self?: string[];
  userImages?: {
    url: string;
    isMain: boolean;
  }[];
}

export interface PromotionConfig {
  variant: 'boost' | 'vip' | 'credit' | 'profile';
  title: string;
  subtitle: string;
  ctaText: string;
  ctaColor: string;
  gradientColors: [string, string, string];
  titleColor: string;
  promoImage: string;
  navigationTarget: string;
  navigationParams?: Record<string, any>;
}

export interface FeedItem {
  id: string;
  type: FeedItemType;
  data: FeedUser | PromotionConfig;
  priority?: number;
  expiresAt?: string;
}

export interface FeedResponse {
  success: boolean;
  data: FeedItem[];
  timestamp: string;
}