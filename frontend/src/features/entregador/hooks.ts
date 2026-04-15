import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listEntregadores, getEntregador, createEntregador, updateEntregador, deleteEntregador } from './api';
import { EntregadorRequest } from '@/types/api';

export function useEntregadores() {
  return useQuery({ queryKey: qk.entregador.all, queryFn: listEntregadores });
}

export function useEntregador(id: number) {
  return useQuery({ queryKey: qk.entregador.byId(id), queryFn: () => getEntregador(id) });
}

export function useCreateEntregador() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: EntregadorRequest) => createEntregador(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.entregador.all });
      toast.success('Entregador criado com sucesso!');
    },
  });
}

export function useUpdateEntregador(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: EntregadorRequest) => updateEntregador(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.entregador.all });
      qc.invalidateQueries({ queryKey: qk.entregador.byId(id) });
      toast.success('Entregador atualizado com sucesso!');
    },
  });
}

export function useDeleteEntregador() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEntregador(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.entregador.all });
      toast.success('Entregador excluído com sucesso!');
    },
  });
}
