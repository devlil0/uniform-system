import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listFardos, getFardo, createFardo, updateFardo, deleteFardo } from './api';
import { FardoRequest } from '@/types/api';

export function useFardos() {
  return useQuery({ queryKey: qk.fardo.all, queryFn: listFardos });
}

export function useFardo(id: number) {
  return useQuery({ queryKey: qk.fardo.byId(id), queryFn: () => getFardo(id) });
}

export function useCreateFardo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: FardoRequest) => createFardo(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.fardo.all });
      toast.success('Fardo criado com sucesso!');
    },
  });
}

export function useUpdateFardo(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: FardoRequest) => updateFardo(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.fardo.all });
      qc.invalidateQueries({ queryKey: qk.fardo.byId(id) });
      toast.success('Fardo atualizado com sucesso!');
    },
  });
}

export function useDeleteFardo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteFardo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.fardo.all });
      toast.success('Fardo excluído com sucesso!');
    },
  });
}
