import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listUniformes, getUniforme, createUniforme, updateUniforme, deleteUniforme } from './api';
import { UniformeRequest } from '@/types/api';

export function useUniformes() {
  return useQuery({ queryKey: qk.uniforme.all, queryFn: listUniformes });
}

export function useUniforme(id: number) {
  return useQuery({ queryKey: qk.uniforme.byId(id), queryFn: () => getUniforme(id) });
}

export function useCreateUniforme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UniformeRequest) => createUniforme(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.uniforme.all });
      toast.success('Uniforme criado com sucesso!');
    },
  });
}

export function useUpdateUniforme(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UniformeRequest) => updateUniforme(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.uniforme.all });
      qc.invalidateQueries({ queryKey: qk.uniforme.byId(id) });
      toast.success('Uniforme atualizado com sucesso!');
    },
  });
}

export function useDeleteUniforme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteUniforme(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.uniforme.all });
      toast.success('Uniforme excluído com sucesso!');
    },
  });
}
