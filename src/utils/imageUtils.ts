const maleAvatar = require('../assets/img/man_avt.png');
const femaleAvatar = require('../assets/img/woman_avt.png');

const BASE_URL = __DEV__ ? 'http://192.168.0.133:5001' : 'https://your-production-url.com';

export const getFullImageUrl = (relativeUrl?: string) => {
  if (!relativeUrl) return null;
  if (relativeUrl.startsWith('http')) return `${relativeUrl}?t=${Date.now()}`;
  return `${BASE_URL}${relativeUrl}?t=${Date.now()}`;
};
export const getUserAvatarSource = (userOrOptions: { avatarUrl?: string | null; gender?: string }) => {
  const { avatarUrl, gender } = userOrOptions;
  if (avatarUrl) return { uri: getFullImageUrl(avatarUrl) };
  return gender === 'women' ? femaleAvatar : maleAvatar;
};