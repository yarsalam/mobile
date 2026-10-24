import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const fetchFullUserProfile = async (userId: number) => {
  const result = await fetchWithAuth(`/users/profile/${userId}`);
  if (result && result.message === 'User blocked') {
    throw new Error('این کاربر توسط شما مسدود شده است');
  }
  return result;
};
