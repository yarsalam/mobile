import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useAuth} from '../../../context/AuthContext';

import {
  countUnread,
  fetchInteractionCount,
  fetchInteractions,
  fetchNotifications,
  fetchSystemCount,
  fetchSystemNotifications,
  markAsRead,
} from '../../queries/notifications';
import {
  fetchBadges,
  markInteractionsRead,
  markSystemRead,
} from '../../queries/notifications';

export const useNotifications = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => fetchNotifications(),
    enabled: !!user?.id,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notifications']});
      queryClient.invalidateQueries({queryKey: ['unread-notifications']});
    },
  });
};

export const useUnreadNotifiCount = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: () => countUnread(),
    enabled: !!user?.id,
    refetchInterval: 60000,
  });
};

export const useInteractions = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ['interactions', user?.id],
    queryFn: fetchInteractions,
    enabled: !!user?.id,
  });
};

export const useSystemNotifications = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ['system-notifications', user?.id],
    queryFn: fetchSystemNotifications,
    enabled: !!user?.id,
  });
};

export const useNotificationBadges = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ['badges', user?.id],
    queryFn: fetchBadges,
    enabled: !!user?.id,
    refetchInterval: 30000, // هر ۳۰ ثانیه
  });
};

export const useMarkInteractionsRead = () => {
  const queryClient = useQueryClient();
  const {user} = useAuth();
  return useMutation({
    mutationFn: markInteractionsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['badges', user?.id]});
      queryClient.invalidateQueries({queryKey: ['interactions', user?.id]});
    },
  });
};

export const useMarkSystemRead = () => {
  const queryClient = useQueryClient();
  const {user} = useAuth();
  return useMutation({
    mutationFn: markSystemRead,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['badges', user?.id]});
      queryClient.invalidateQueries({
        queryKey: ['system-notifications', user?.id],
      });
    },
  });
};
