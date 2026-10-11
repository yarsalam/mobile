import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const reportUser = async (
  reporterId: number,
  reportedUserId: number,
  reason: string,
  message?: string,
  blockUser?: boolean,
) => {
  return fetchWithAuth('http://192.168.0.133:5001/report-block/report', {
    method: 'POST',
    body: JSON.stringify({
      reporterId,
      reportedUserId,
      reason,
      message,
      blockUser,
    }),
  });
};

export const blockUser = async (userId: number, targetId: number) => {
  return fetchWithAuth('http://192.168.0.133:5001/report-block/block', {
    method: 'POST',
    body: JSON.stringify({userId, targetId}),
  });
};
