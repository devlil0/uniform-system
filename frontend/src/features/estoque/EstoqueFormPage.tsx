import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { estoqueSchema } from './schema';
import { useEstoqueItem, useCreateEstoque, useUpdateEstoque } from './hooks';
import { useUniformes } from '@/features/uniforme/hooks';
import { useClientes } from '@/features/cliente/hooks';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { EstoqueRequest } from '@/types/api';

export function EstoqueFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const numericId = id ? Number(id) : 0;

  const { data: existing, isLoading } = useEstoqueItem(numericId);
  const { data: uniformes } = useUniformes();
  const { data: clientes } = useClientes();
  const createMutation = useCreateEstoque();
  const updateMutation = useUpdateEstoque(numericId);
  const mutation = isEdit ? updateMutation : createMutation;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(estoqueSchema),
    defaultValues: { vinculadoCliente: false, clienteId: 0 },
  });

  const vinculado = watch('vinculadoCliente');

  useEffect(() => {
    if (existing) {
      reset({
        id: existing.id,
        uniformeId: existing.uniformeResponse.id,
        quantidade: existing.quantidade,
        vinculadoCliente: existing.vinciuladoCliente,
        clienteId: existing.clienteResponse?.id ?? 0,
      });
    }
  }, [existing, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    const payload = values as unknown as EstoqueRequest;
    mutation.mutate(
      {
        ...payload,
        clienteId: payload.vinculadoCliente ? payload.clienteId : 0,
      },
      { onSuccess: () => navigate('/estoque') },
    );
  };

  if (isEdit && isLoading) return <FullPageSpinner />;

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Estoque' : 'Novo Item de Estoque'} />
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isEdit && (
            <FormField label="ID" required error={errors.id?.message as string}>
              <Input type="number" {...register('id')} placeholder="Ex.: 1" />
            </FormField>
          )}
          <FormField label="Uniforme" required error={errors.uniformeId?.message as string}>
            <Select {...register('uniformeId')}>
              <option value="">Selecione um uniforme...</option>
              {uniformes?.map((u) => <option key={u.id} value={u.id}>{u.nome} — {u.tamanho} / {u.cor}</option>)}
            </Select>
          </FormField>
          <FormField label="Quantidade" required error={errors.quantidade?.message as string}>
            <Input type="number" min={0} {...register('quantidade')} placeholder="0" />
          </FormField>
          <FormField label="" error={undefined}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input type="checkbox" {...register('vinculadoCliente')} className="h-4 w-4 rounded border-gray-300" />
              Vinculado a cliente
            </label>
          </FormField>
          {vinculado && (
            <FormField label="Cliente" error={errors.clienteId?.message as string}>
              <Select {...register('clienteId')}>
                <option value="0">Selecione um cliente...</option>
                {clientes?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </Select>
            </FormField>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/estoque')}>Cancelar</Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Salvar alterações' : 'Criar item'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
