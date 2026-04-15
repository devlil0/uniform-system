import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listItensPedido, createItemPedido, deleteItemPedido } from './api';
import { ItemPedidoRequest } from '@/types/api';

export function useItensPedido() {
  return useQuery({ queryKey: qk.itemPedido.all, queryFn: listItensPedido });
}

export function useCreateItemPedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ItemPedidoRequest) => createItemPedido(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.itemPedido.all });
      toast.success('Item adicionado ao pedido!');
    },
  });
}

export function useDeleteItemPedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItemPedido(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.itemPedido.all });
      toast.success('Item removido do pedido!');
    },
  });
}
