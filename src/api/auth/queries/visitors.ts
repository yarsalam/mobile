import {fetchWithAuth} from '../../../lib/fetchWithAuth';

export const getVisitedProfiles = async (userId: number) => {
  return fetchWithAuth(
    `http://192.168.0.133:5001/profile-visitors/visited/${userId}`,
  );
};

export const getProfileVisitors = async () => {
  // ← userId حذف شد
  return fetchWithAuth(`http://192.168.0.133:5001/profile-visitors`);
};

export const recordVisit = async (profileId: number) => {
  return fetchWithAuth(`http://192.168.0.133:5001/profile-visitors`, {
    method: 'POST', // ← اضافه شد
    body: JSON.stringify({profileId}), // ← profileId به body
  });
};

export const markVisitorRead = async (visitorId: number) => {
  return fetchWithAuth(
    `http://192.168.0.133:5001/profile-visitors/mark-read/${visitorId}`,
    {
      method: 'PATCH', // ← اضافه شد
      body: JSON.stringify({visitorId}), // ← profileId به body
    },
  );
};
