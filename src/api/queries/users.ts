import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const fetchFullUserProfile = async (userId: number) => {
  try {
    const result = await fetchWithAuth(
      `http://192.168.0.133:5001/users/profile/${userId}`,
    );
    if (result && result.message === 'User blocked') {
      throw new Error('این کاربر توسط شما مسدود شده است');
    }
    return result;
  } catch (err) {
    console.error(`Error fetching user ${userId}:`, err);
    throw err;
  }
};
