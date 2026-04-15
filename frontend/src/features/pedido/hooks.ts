import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listPedidos, getPedido, createPedido, updatePedido, deletePedido } from './api';
import { PedidoRequest } from '@/types/api';

export function usePedidos() {
  return useQuery({ queryKey: qk.pedido.all, queryFn: listPedidos });
}

export function usePedido(id: number) {
  return useQuery({ queryKey: qk.pedido.byId(id), queryFn: () => getPedido(id) });
}

export function useCreatePedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PedidoRequest) => createPedido(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.pedido.all });
      toast.success('Pedido criado com sucesso!');
    },
  });
}

export function useUpdatePedido(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PedidoRequest) => updatePedido(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.pedido.all });
      qc.invalidateQueries({ queryKey: qk.pedido.byId(id) });
      toast.success('Pedido atualizado com sucesso!');
    },
  });
}

export function useDeletePedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePedido(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.pedido.all });
      toast.success('Pedido excluído com sucesso!');
    },
  });
}
