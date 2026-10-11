import React, {createContext, useContext} from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import {useAuth} from './AuthContext';
import {
  fetchUserImages,
  uploadImageApi,
  deleteImageApi,
  setMainImageApi,
} from '../api/queries/image'; // توابع از فایل جدا
import {useToast} from './ToastContext';

export interface Image {
  id: number;
  url: string;
  isMain: boolean;
  filename: string;
}
interface ImageContextType {
  images: Image[];
  mainImage?: Image;
  refetch: () => Promise<any>;
  uploadImage: ReturnType<typeof useMutation<FormData, unknown, FormData>>;
  deleteImage: UseMutationResult<void, Error, DeleteImageParams>;
  setMainImage: ReturnType<typeof useMutation<unknown, unknown, string>>;
}
type DeleteImageParams = {
  filename: string;
  newMainImageId?: number; // به‌جای filename
};
const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({children}: {children: React.ReactNode}) => {
  const {user} = useAuth();
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  const {data: fetchedData, refetch} = useQuery({
    queryKey: ['my-images', user?.id],
    queryFn: () => fetchUserImages(user?.id || ''),
    enabled: !!user?.id,
  });

  const images = fetchedData?.images ?? [];
  const mainImage = images.find(img => img.isMain === true);

  const uploadImage = useMutation({
    mutationFn: uploadImageApi,
    onSuccess: () => {
      showToast('تصویر با موفقیت آپلود شد', 'success');
      refetch();
    },
    onError: () => {
      showToast('آپلود تصویر با خطا مواجه شد', 'error');
    },
  });

  const deleteImage = useMutation<void, Error, DeleteImageParams>({
    mutationFn: ({filename, newMainImageId}) =>
      deleteImageApi(filename, newMainImageId),
    onSuccess: () => {
      showToast('تصویر با موفقیت حذف شد', 'success');
      queryClient.invalidateQueries({queryKey: ['images']});
    },
    onError: () => {
      showToast('حذف تصویر با خطا مواجه شد', 'error');
    },
  });

  const setMainImage = useMutation({
    mutationFn: setMainImageApi,
    onSuccess: () => {
      showToast('تصویر اصلی با موفقیت تنظیم شد', 'success');
      refetch();
    },
    onError: () => {
      showToast('تنظیم تصویر اصلی با خطا مواجه شد', 'error');
    },
  });

  return (
    <ImageContext.Provider
      value={{
        images,
        mainImage,
        refetch,
        uploadImage,
        deleteImage,
        setMainImage,
      }}>
      {children}
    </ImageContext.Provider>
  );
};
export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext باید داخل ImageProvider استفاده شود');
  }
  return context;
};
