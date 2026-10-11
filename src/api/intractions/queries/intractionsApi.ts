import {fetchWithAuth} from '../../../lib/fetchWithAuth';

const API_BASE = 'http://192.168.0.133:5001';

export const checkLikeStatus = async (targetUserId: number) => {
  const res = await fetchWithAuth(
    `${API_BASE}/interactions/status/${targetUserId}`,
  );
  console.log('checkLikeStatus raw response:', res);
  return res; // چون fetchWithAuth قبلاً JSON را برمی‌گرداند
};

export const likeUser = async (targetUserId: number) => {
  return fetchWithAuth(`${API_BASE}/interactions/${targetUserId}/like`, {
    method: 'POST',
  });
};

export const superLikeUser = async (targetUserId: number) => {
  return fetchWithAuth(`${API_BASE}/interactions/${targetUserId}/superlike`, {
    method: 'POST',
  });
};

export const passUser = async (targetUserId: number) => {
  return fetchWithAuth(`${API_BASE}/interactions/${targetUserId}/skip`, {
    method: 'POST',
  });
};

export const reportUser = async (
  reporterId: number,
  reportedUserId: number,
  reason: string,
) => {
  return fetchWithAuth(`${API_BASE}/report-block/report`, {
    method: 'POST',
    body: JSON.stringify({
      reporterId,
      reportedUserId,
      reason,
      blockUser: false,
    }),
  });
};

export const blockUser = async (userId: number, targetId: number) => {
  return fetchWithAuth(`${API_BASE}/report-block/block`, {
    method: 'POST',
    body: JSON.stringify({userId, targetId}),
  });
};

export const unblockUser = async (userId: number, targetId: number) => {
  return fetchWithAuth(`${API_BASE}/report-block/unBlock`, {
    method: 'POST',
    body: JSON.stringify({userId, targetId}),
  });
};

export const dismissPromotion = async (promotionId: string) => {
  return fetchWithAuth(`${API_BASE}/feed/dismiss/${promotionId}`, {
    method: 'POST',
  });
};

export const getFeed = async (limit = 20) => {
  const res = await fetchWithAuth(`${API_BASE}/feed?limit=${limit}`);
  if (res?.success && Array.isArray(res?.data)) {
    return res.data;
  }
  console.warn('Unexpected feed response:', res);
  return [];
};

export const fetchRelationStatus = (userId: number, targetId: number) =>
  fetchWithAuth(`http://192.168.0.133:5001/relation-status/${targetId}`);
