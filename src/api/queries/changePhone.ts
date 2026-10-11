import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const sendChangePhoneCode = (
  phone: string,
  channel: 'telegram' | 'whatsapp',
  otp?: string,
) =>
  fetchWithAuth('/user-phones/change', {
    method: 'POST',
    body: JSON.stringify({phone, channel, otp}),
  });

export const verifyChangePhoneCode = (
  phone: string,
  code: string | undefined,
  channel: 'telegram' | 'whatsapp',
) =>
  fetchWithAuth('/user-phones/verify', {
    method: 'POST',
    body: JSON.stringify({phone, code, channel}),
  });
