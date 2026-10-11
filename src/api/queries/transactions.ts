import {fetchWithAuth} from '../../lib/fetchWithAuth';

// The current backend has no user-facing transactions controller/route.
// Avoid issuing the former invalid GET-with-body request to a nonexistent endpoint.
export const getTransactions = async (_password?: string): Promise<never> => {
  throw new Error('نمایش تراکنش‌ها هنوز در API بک‌اند پیاده‌سازی نشده است.');
};
