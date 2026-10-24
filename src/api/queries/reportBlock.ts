import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const reportUser = async (
  _reporterId: number,
  reportedUserId: number,
  reason: string,
  message?: string,
  blockUser?: boolean,
) =>
  fetchWithAuth('/report-block/report', {
    method: 'POST',
    // Reporter identity is derived from the JWT on the backend.
    body: JSON.stringify({reportedUserId, reason, message, blockUser}),
  });

export const blockUser = async (_userId: number, targetId: number) =>
  fetchWithAuth('/report-block/block', {
    method: 'POST',
    // The backend accepts targetId only and derives the acting user from JWT.
    body: JSON.stringify({targetId}),
  });

export const unblockUser = async (targetId: number) =>
  fetchWithAuth('/report-block/unblock', {
    method: 'POST',
    body: JSON.stringify({targetId}),
  });

export const getBlockedUsers = () => fetchWithAuth('/report-block/blocked');
