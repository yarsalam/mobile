// The backend currently exposes face verification only through an admin-guarded
// route; there is no authenticated user endpoint for requesting or reading status.
export const requestVerification = async (_selfieFile: {uri: string; type: string; name: string}): Promise<never> => {
  throw new Error('درخواست تأیید چهره از سمت API کاربر هنوز پیاده‌سازی نشده است.');
};

export const getVerificationStatus = async (): Promise<never> => {
  throw new Error('دریافت وضعیت تأیید چهره از API کاربر هنوز پیاده‌سازی نشده است.');
};
