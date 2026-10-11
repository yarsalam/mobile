import {useQuery} from '@tanstack/react-query';
import { fetchRelationStatus } from '../intractions/queries/intractionsApi';

// api/queries/relations.ts
export const useRelationStatus = (targetId: number | undefined) =>
  useQuery({
    queryKey: ['relation', targetId],
    queryFn: () => fetchRelationStatus(0, targetId!), // userId از توکن می‌آید
    enabled: !!targetId,
    staleTime: 1000 * 60 * 2,
  });
