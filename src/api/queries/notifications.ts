import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const fetchBadges = () => fetchWithAuth('/badges');

export const markInteractionsRead = () =>
  fetchWithAuth('/notifications/read-all/interactions', {method: 'PATCH'});

export const markSystemRead = () =>
  fetchWithAuth('/notifications/read-all/system', {method: 'PATCH'});

export const fetchInteractions = () => fetchWithAuth('/notifications/interactions');
export const fetchSystemNotifications = () => fetchWithAuth('/notifications/system');
export const fetchNotifications = () => fetchWithAuth('/notifications');
export const markAsRead = (notificationId: number) =>
  fetchWithAuth(`/notifications/read/${notificationId}`, {method: 'PATCH'});
