import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listEstoque, getEstoque, createEstoque, updateEstoque, deleteEstoque } from './api';
import { EstoqueRequest } from '@/types/api';

export function useEstoque() {
  return useQuery({ queryKey: qk.estoque.all, queryFn: listEstoque });
}

export function useEstoqueItem(id: number) {
  return useQuery({ queryKey: qk.estoque.byId(id), queryFn: () => getEstoque(id) });
}

export function useCreateEstoque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: EstoqueRequest) => createEstoque(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.estoque.all });
      toast.success('Item de estoque criado com sucesso!');
    },
  });
}

export function useUpdateEstoque(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: EstoqueRequest) => updateEstoque(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.estoque.all });
      qc.invalidateQueries({ queryKey: qk.estoque.byId(id) });
      toast.success('Estoque atualizado com sucesso!');
    },
  });
}

export function useDeleteEstoque() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEstoque(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.estoque.all });
      toast.success('Item de estoque excluído com sucesso!');
    },
  });
}
