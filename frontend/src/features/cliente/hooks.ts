import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listClientes, getCliente, createCliente, updateCliente, deleteCliente } from './api';
import { ClienteRequest } from '@/types/api';

export function useClientes() {
  return useQuery({ queryKey: qk.cliente.all, queryFn: listClientes });
}

export function useCliente(id: number) {
  return useQuery({ queryKey: qk.cliente.byId(id), queryFn: () => getCliente(id) });
}

export function useCreateCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ClienteRequest) => createCliente(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cliente.all });
      toast.success('Cliente criado com sucesso!');
    },
  });
}

export function useUpdateCliente(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ClienteRequest) => updateCliente(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cliente.all });
      qc.invalidateQueries({ queryKey: qk.cliente.byId(id) });
      toast.success('Cliente atualizado com sucesso!');
    },
  });
}

export function useDeleteCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCliente(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cliente.all });
      toast.success('Cliente excluído com sucesso!');
    },
  });
}
