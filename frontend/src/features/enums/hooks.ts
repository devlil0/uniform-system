import { useQuery } from '@tanstack/react-query';
import { qk } from '@/lib/query-keys';
import { listEnums } from './api';

export function useEnums() {
  return useQuery({
    queryKey: qk.enums,
    queryFn: listEnums,
    staleTime: Infinity,
  });
}
