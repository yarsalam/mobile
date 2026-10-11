import {fetchWithAuth} from '../../../lib/fetchWithAuth';

export const checkLikeStatus = (targetUserId: number) =>
  fetchWithAuth('/interactions/status/' + targetUserId);

export const likeUser = (targetUserId: number) =>
  fetchWithAuth('/interactions/' + targetUserId + '/like', {method: 'POST'});

export const superLikeUser = (targetUserId: number) =>
  fetchWithAuth('/interactions/' + targetUserId + '/superlike', {method: 'POST'});

export const passUser = (targetUserId: number) =>
  fetchWithAuth('/interactions/' + targetUserId + '/skip', {method: 'POST'});

export const reportUser = async (
  _reporterId: number,
  reportedUserId: number,
  reason: string,
) =>
  fetchWithAuth('/report-block/report', {
    method: 'POST',
    body: JSON.stringify({reportedUserId, reason, blockUser: false}),
  });

export const blockUser = async (_userId: number, targetId: number) =>
  fetchWithAuth('/report-block/block', {
    method: 'POST',
    body: JSON.stringify({targetId}),
  });

export const unblockUser = async (_userId: number, targetId: number) =>
  fetchWithAuth('/report-block/unblock', {
    method: 'POST',
    body: JSON.stringify({targetId}),
  });

export const dismissPromotion = (promotionId: string) =>
  fetchWithAuth('/feed/dismiss/' + encodeURIComponent(promotionId), {
    method: 'POST',
  });

export const getFeed = async (limit = 20) => {
  const res = await fetchWithAuth('/feed?limit=' + limit);
  if (res?.success && Array.isArray(res?.data)) return res.data;
  return [];
};

export const fetchRelationStatus = (_userId: number, targetId: number) =>
  fetchWithAuth('/relation-status/' + targetId);
