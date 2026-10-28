import {API_BASE_URL} from '../config/api';

const maleAvatar = require('../assets/img/man_avt.png');
const femaleAvatar = require('../assets/img/woman_avt.png');

export const getFullImageUrl = (relativeUrl?: string) => {
  if (!relativeUrl) return null;
  if (relativeUrl.startsWith('http')) return `${relativeUrl}?t=${Date.now()}`;
  return `${API_BASE_URL}${relativeUrl}?t=${Date.now()}`;
};
export const getUserAvatarSource = (userOrOptions: { avatarUrl?: string | null; gender?: string }) => {
  const { avatarUrl, gender } = userOrOptions;
  if (avatarUrl) return { uri: getFullImageUrl(avatarUrl) };
  return gender === 'women' ? femaleAvatar : maleAvatar;
};