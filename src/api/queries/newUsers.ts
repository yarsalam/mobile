import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const getRecentSimilarUsers = async (limit = 5) => {
  // userId حذف شد — سرور از JWT می‌خونه
  return fetchWithAuth(
    `http://192.168.0.133:5001/users/recent-similar?limit=${limit}&daysAgo=30`,
  );
};
