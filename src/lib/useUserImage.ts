import {useMemo} from 'react';
import {API_BASE_URL} from '../config/api';

interface UserImage {
  url: string;
  isMain: boolean;
}

interface User {
  id: number;
  userImages?: UserImage[];
  updatedAt?: string;
}

export const useUserImage = (user: User) => {
  const mainImageUrl = useMemo(() => {
    // 1. اولویت با تصویر اصلی
    const mainImage = user.userImages?.find(img => img.isMain);
    if (mainImage) {
      return `${API_BASE_URL}${mainImage.url}?t=${user.updatedAt || Date.now()}`;
    }

    // 2. اولین تصویر
    const firstImage = user.userImages?.[0];
    if (firstImage) {
      return `${API_BASE_URL}${firstImage.url}?t=${user.updatedAt || Date.now()}`;
    }

    // 3. placeholder
    return 'https://via.placeholder.com/400x500/2a2a2a/ffffff?text=User';
  }, [user.userImages, user.updatedAt]);

  const hasImages = (user.userImages?.length || 0) > 0;
  const imageCount = user.userImages?.length || 0;

  return { mainImageUrl, hasImages, imageCount };
};