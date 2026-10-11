import {locationOption} from './data';

export const mapFiltersToApi = (filters: Record<string, any>) => {
  const payload: Record<string, any> = {};

  const rangeMap: Record<string, [string, string]> = {
    age: ['minAge', 'maxAge'],
    weight: ['minWeight', 'maxWeight'],
    height: ['minHeight', 'maxHeight'],
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value) && value.length === 0) return;

    if (rangeMap[key]) {
      const [minKey, maxKey] = rangeMap[key];
      if (value.min !== undefined) payload[minKey] = value.min;

      if (value.max !== undefined) payload[maxKey] = value.max;
      return;
    }

    if (key === 'city') {
      const provinces = value.filter((v: string) =>
        locationOption.some(p => p.province === v),
      );
      const cities = value.filter((v: string) => !provinces.includes(v));
      if (provinces.length) payload.province = provinces;
      if (cities.length) payload.city = cities;
      return;
    }

    payload[key] = value;
  });
  return payload;
};
