import React from 'react';
import { View } from 'react-native';
import DynamicSkeleton from './DynamicSkeleton';

interface LoadingWrapperProps {
  isLoading: boolean;
  hasData: boolean;
  skeletonType: 'feed' | 'suggestions' | 'visitors' | 'newUsers';
  skeletonCount?: number;
  children: React.ReactNode;
  /** کامپوننتی که وقتی بارگذاری تمام شد و داده‌ای وجود نداشت نشان داده شود */
  emptyComponent?: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  hasData,
  skeletonType,
  skeletonCount = 1,
  children,
  emptyComponent,
}) => {
  // در حال بارگذاری و هنوز داده‌ای نیست → اسکلتون
  if (isLoading && !hasData) {
    return <DynamicSkeleton type={skeletonType} count={skeletonCount} />;
  }

  // بارگذاری تمام شده و داده‌ای وجود ندارد → تبلیغ / EmptyState
  if (!isLoading && !hasData) {
    return <>{emptyComponent || null}</>;
  }

  // داده وجود دارد (چه در حال بارگذاری چه نه) → محتوای اصلی
  return <>{children}</>;
};

export default LoadingWrapper;