import {fetchWithAuth} from '../../lib/fetchWithAuth';

export const changePassword = (password: string) =>
  fetchWithAuth('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({password}),
  });
