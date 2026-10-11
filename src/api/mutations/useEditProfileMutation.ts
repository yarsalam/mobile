import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuth} from '../../context/AuthContext';
import {useToast} from '../../context/ToastContext';
import {EditProfileData} from '../../schemas/editProfileSchema';
import {updateUserProfile} from '../queries/updateUserProfile';

export const useEditProfileMutation = () => {
  // ✅ همه hook‌ها بدون هیچ شرطی در بالا
  const queryClient = useQueryClient();
  const {user} = useAuth();
  const {showToast} = useToast();

  return useMutation({
    mutationFn: (data: EditProfileData) => {
      if (!user?.id) throw new Error('کاربر یافت نشد');
      return updateUserProfile(user.id, data); // ✅ حالا number است، نه number|undefined
    },
    onSuccess: () => {
      showToast('پروفایل با موفقیت ویرایش شد', 'success');
      queryClient.invalidateQueries({queryKey: ['me']}); // ✅ v5 syntax
    },
    onError: (err: any) => {
      showToast(err?.message || 'خطا در به‌روزرسانی', 'error');
    },
  });
};
