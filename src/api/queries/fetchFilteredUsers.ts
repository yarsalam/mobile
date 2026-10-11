// fetchFilteredUsers.ts — دقیقاً همونی که انتخاب کردی
import {fetchWithAuth} from '../../lib/fetchWithAuth';
import {mapFiltersToApi} from '../../utils/mapFiltersToApi';

const BASE = 'http://192.168.0.133:5001';

export const fetchFilteredUsers = async ({
  page = 0,
  limit = 10,
  ...filters
}: Record<string, any>) => {
  return fetchWithAuth(`${BASE}/users/filter?page=${page}&limit=${limit}`, {
    method: 'POST',
    body: JSON.stringify(mapFiltersToApi(filters)),
  });
};

export const fetchFilterCount = (filters: Record<string, any>) =>
  fetchWithAuth(`${BASE}/users/filter/count`, {
    method: 'POST',
    body: JSON.stringify(mapFiltersToApi(filters)),
  });
