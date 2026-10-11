import {useQuery} from '@tanstack/react-query';
import {getProfileVisitors} from '../../auth/queries/visitors';

export const useVisitors = () => {
  // ← بدون هیچ پارامتری
  return useQuery({
    queryKey: ['visitors'],
    queryFn: () => getProfileVisitors(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    // enabled نداره — همیشه اجرا می‌شه چون auth از JWT میاد
  });
};
