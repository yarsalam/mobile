import {fetchWithAuth} from '../../../lib/fetchWithAuth';

export const getVisitedProfiles = async (_userId?: number): Promise<never> => {
  // Backend exposes visitors to the signed-in user, not profiles this user visited.
  throw new Error('فهرست پروفایل‌هایی که بازدید کرده‌اید هنوز در API بک‌اند وجود ندارد.');
};

export const getProfileVisitors = () => fetchWithAuth('/profile-visitors');

export const recordVisit = (profileId: number) =>
  fetchWithAuth('/profile-visitors', {
    method: 'POST',
    body: JSON.stringify({profileId}),
  });

export const markVisitorRead = (visitorId: number) =>
  fetchWithAuth('/profile-visitors/mark-read/' + visitorId, {
    method: 'PATCH',
  });
