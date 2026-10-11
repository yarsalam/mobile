import { fetchWithAuth } from "../../lib/fetchWithAuth";


export const fetchUserImages = async (userId: number | string) => {
  if (!userId) {
    throw new Error('شناسه کاربر مشخص نیست');
  }
  return await fetchWithAuth(`http://192.168.0.133:5001/user-image/${userId}`);
};

// ✅ آپلود تصویر
export const uploadImageApi = async (formData: FormData) => {
  return await fetchWithAuth(`http://192.168.0.133:5001/user-image/upload`, {
    method: 'POST',
    body: formData,
  });
};

// ✅ ست کردن تصویر اصلی
export const setMainImageApi = async (imageUrl: string) => {
  const res = await fetchWithAuth(`http://192.168.0.133:5001/user-image/set-main`, {
    method: 'POST',
    body: JSON.stringify({imageUrl}),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // if (!res.ok) throw new Error('خطا در تعیین تصویر اصلی');
  // return res.json();
};

// ✅ حذف تصویر
export const deleteImageApi = async (
  filename: string,
  newMainImageId?: number,
) => {
  const body = JSON.stringify({newMainImageId: newMainImageId ?? null});

  const data = await fetchWithAuth(
    `http://192.168.0.133:5001/user-image/${filename}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body, // باید شامل { newMainImageId: null } باشد
    },
  );
  return data;
};
