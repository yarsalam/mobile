import {useMutation, useQueryClient} from '@tanstack/react-query';
import {markVisitorRead} from '../../auth/queries/visitors';

export const useMarkVisitorRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileId: number) => markVisitorRead(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['visitors']});
    },
  });
};
