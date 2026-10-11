import {useMutation} from '@tanstack/react-query';
import {recordVisit} from '../../auth/queries/visitors';

export const useRecordVisit = () => {
  return useMutation({
    mutationFn: (profileId: number) => recordVisit(profileId),
    onError: err => console.error('Failed to record visit:', err),
  });
};
