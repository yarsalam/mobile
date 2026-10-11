// The only current backend route for granting a free boost is protected by
// AdminApiGuard. The mobile app must not call an admin-only endpoint.
export const grantFreeBoost = async (_userId: number): Promise<never> => {
  throw new Error('فعال‌سازی بوست رایگان از API کاربر پشتیبانی نمی‌شود.');
};
