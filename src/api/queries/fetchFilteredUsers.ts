import {fetchWithAuth} from '../../lib/fetchWithAuth';
import {mapFiltersToApi} from '../../utils/mapFiltersToApi';

export const fetchFilteredUsers = async ({
  page = 0,
  limit = 10,
  ...filters
}: Record<string, any>) =>
  fetchWithAuth(`/users/filter?page=${page}&limit=${limit}`, {
    method: 'POST',
    body: JSON.stringify(mapFiltersToApi(filters)),
  });

export const fetchFilterCount = (filters: Record<string, any>) =>
  fetchWithAuth('/users/filter/count', {
    method: 'POST',
    body: JSON.stringify(mapFiltersToApi(filters)),
  });
