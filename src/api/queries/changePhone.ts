import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const sendChangePhoneCode = (
  phone: string,
  channel: 'telegram' | 'whatsapp',
  otp?: string,
) =>
  fetchWithAuth('http://192.168.0.133:5001/user-phones/change', {
    method: 'POST',
    body: JSON.stringify({phone, channel, otp}),
  });

export const verifyChangePhoneCode = (
  phone: string,
  code: string | undefined,
  channel: 'telegram' | 'whatsapp',
) =>
  fetchWithAuth('http://192.168.0.133:5001/user-phones/verify', {
    method: 'POST',
    body: JSON.stringify({phone, code, channel}),
  });
