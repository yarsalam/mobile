import {useMutation} from '@tanstack/react-query';
import {useToast} from '../../../context/ToastContext';
import {logoutApi} from '../queries/auth';
import {useAuth} from '../../../context/AuthContext';

export function useLogoutMutation() {
  const {showToast} = useToast();
  const {logout} = useAuth();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: async () => {
      await logout();
      showToast('خروج موفق', 'success');
    },
  });
}
