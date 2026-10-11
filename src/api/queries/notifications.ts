import {fetchWithAuth} from '../../lib/fetchWithAuth';

const BASE = 'http://192.168.0.133:5001/notifications';
const BADGE_BASE = 'http://192.168.0.133:5001/badges';

export const fetchBadges = () => fetchWithAuth(BADGE_BASE); // ← آدرس درست

export const markInteractionsRead = () =>
  fetchWithAuth(`${BASE}/read-all/interactions`, {method: 'PATCH'});

export const markSystemRead = () =>
  fetchWithAuth(`${BASE}/read-all/system`, {method: 'PATCH'});

export const fetchInteractions = () => fetchWithAuth(`${BASE}/interactions`);
export const fetchSystemNotifications = () => fetchWithAuth(`${BASE}/system`);
export const fetchNotifications = () => fetchWithAuth(`${BASE}`);
export const markAsRead = (notificationId: number) =>
  fetchWithAuth(`${BASE}/read/${notificationId}`, {method: 'PATCH'});
