import {fetchWithAuth} from '../../lib/fetchWithAuth';
import {EditProfileData} from '../../schemas/editProfileSchema';

export const updateUserProfile = async (
  userId: number, // ✅ دیگر undefined نمی‌گیرد
  data: EditProfileData,
) => {
  return fetchWithAuth(`http://192.168.0.133:5001/users/${userId}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
};