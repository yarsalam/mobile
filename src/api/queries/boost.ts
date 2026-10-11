import { fetchWithAuth } from '../../lib/fetchWithAuth';

export const grantFreeBoost = async (userId: number) => {
  return fetchWithAuth(`http://192.168.0.133:5001/boost/grant-free/${userId}`, {
    method: 'POST',
  });
};