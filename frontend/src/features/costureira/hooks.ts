import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listCostureiras, getCostureira, createCostureira, updateCostureira, deleteCostureira } from './api';
import { CostureiraRequest } from '@/types/api';

export function useCostureiras() {
  return useQuery({ queryKey: qk.costureira.all, queryFn: listCostureiras });
}

export function useCostureira(id: number) {
  return useQuery({ queryKey: qk.costureira.byId(id), queryFn: () => getCostureira(id) });
}

export function useCreateCostureira() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CostureiraRequest) => createCostureira(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.costureira.all });
      toast.success('Costureira criada com sucesso!');
    },
  });
}

export function useUpdateCostureira(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CostureiraRequest) => updateCostureira(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.costureira.all });
      qc.invalidateQueries({ queryKey: qk.costureira.byId(id) });
      toast.success('Costureira atualizada com sucesso!');
    },
  });
}

export function useDeleteCostureira() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCostureira(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.costureira.all });
      toast.success('Costureira excluída com sucesso!');
    },
  });
}
