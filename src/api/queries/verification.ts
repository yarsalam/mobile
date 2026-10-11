import { fetchWithAuth } from '../../lib/fetchWithAuth';

const BASE = 'http://192.168.0.133:5001/verification';

// ارسال سلفی برای تأیید (multipart/form-data)
export const requestVerification = async (selfieFile: { uri: string; type: string; name: string }) => {
  const formData = new FormData();
  formData.append('selfie', {
    uri: selfieFile.uri,
    type: selfieFile.type || 'image/jpeg',
    name: selfieFile.name || 'selfie.jpg',
  } as any);

  // fetchWithAuth احتمالاً نیاز به تنظیم Content-Type دارد
  return fetchWithAuth(`${BASE}/request`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// دریافت وضعیت تأیید (userId از توکن گرفته می‌شود)
export const getVerificationStatus = () =>
  fetchWithAuth(`${BASE}/status`);