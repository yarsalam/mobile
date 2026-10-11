import {fetchWithAuth} from '../../lib/fetchWithAuth';
import {EditProfileData} from '../../schemas/editProfileSchema';

export const updateUserProfile = async (
  userId: number,
  data: EditProfileData,
) =>
  fetchWithAuth(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
