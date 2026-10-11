// utils/decodeToken.ts
import {decode as base64Decode} from 'base-64';

export const decodeToken = (token: string | null): any => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    let payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // padding
    const pad = payload.length % 4;
    if (pad) payload += '='.repeat(4 - pad);

    const decoded = base64Decode(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.log('❌ decodeToken failed', e);
    return null;
  }
};
