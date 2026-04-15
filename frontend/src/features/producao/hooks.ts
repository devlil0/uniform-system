import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qk } from '@/lib/query-keys';
import { listProducoes, getProducao, createProducao, updateProducao, deleteProducao } from './api';
import { ProducaoRequest } from '@/types/api';

export function useProducoes() {
  return useQuery({ queryKey: qk.producao.all, queryFn: listProducoes });
}

export function useProducao(id: number) {
  return useQuery({ queryKey: qk.producao.byId(id), queryFn: () => getProducao(id) });
}

export function useCreateProducao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProducaoRequest) => createProducao(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.producao.all });
      toast.success('Produção registrada com sucesso!');
    },
  });
}

export function useUpdateProducao(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProducaoRequest) => updateProducao(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.producao.all });
      qc.invalidateQueries({ queryKey: qk.producao.byId(id) });
      toast.success('Produção atualizada com sucesso!');
    },
  });
}

export function useDeleteProducao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProducao(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.producao.all });
      toast.success('Produção excluída com sucesso!');
    },
  });
}
