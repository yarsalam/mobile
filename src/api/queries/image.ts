import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const fetchUserImages = async (userId: number | string) => {
  if (!userId) throw new Error('شناسه کاربر مشخص نیست');
  return fetchWithAuth('/user-image/' + encodeURIComponent(String(userId)));
};

export const uploadImageApi = (formData: FormData) =>
  fetchWithAuth('/user-image/upload', {
    method: 'POST',
    body: formData,
  });

export const setMainImageApi = (imageUrl: string) =>
  fetchWithAuth('/user-image/set-main', {
    method: 'POST',
    body: JSON.stringify({imageUrl}),
  });

export const deleteImageApi = (
  filename: string,
  newMainImageId?: number,
) =>
  fetchWithAuth('/user-image/' + encodeURIComponent(filename), {
    method: 'DELETE',
    body: JSON.stringify({newMainImageId: newMainImageId ?? null}),
  });
