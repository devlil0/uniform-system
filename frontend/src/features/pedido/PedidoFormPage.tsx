import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pedidoSchema } from './schema';
import { usePedido, useCreatePedido, useUpdatePedido } from './hooks';
import { useClientes } from '@/features/cliente/hooks';
import { useEnums } from '@/features/enums/hooks';
import { FormField } from '@/components/FormField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { rotulosStatusPedido } from '@/lib/rotulos';
import { PedidoRequest, PedidoResponse } from '@/types/api';

export function PedidoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const numericId = id ? Number(id) : 0;

  const { data: existing, isLoading } = usePedido(numericId);
  const { data: clientes } = useClientes();
  const { data: enums } = useEnums();
  const createMutation = useCreatePedido();
  const updateMutation = useUpdatePedido(numericId);
  const mutation = isEdit ? updateMutation : createMutation;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(pedidoSchema),
  });

  useEffect(() => {
    if (existing) reset({ clienteId: existing.clienteResponse.id, status: existing.status });
  }, [existing, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    mutation.mutate(values as unknown as PedidoRequest, {
      onSuccess: (data) => navigate(`/pedidos/${(data as PedidoResponse).id}`),
    });
  };

  if (isEdit && isLoading) return <FullPageSpinner />;

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Pedido' : 'Novo Pedido'} />
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Cliente" required error={errors.clienteId?.message as string}>
            <Select {...register('clienteId')}>
              <option value="">Selecione um cliente...</option>
              {clientes?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
          </FormField>
          <FormField label="Status" required error={errors.status?.message as string}>
            <Select {...register('status')}>
              <option value="">Selecione um status...</option>
              {enums?.statusPedido.map((value) => (
                <option key={value} value={value}>{rotulosStatusPedido[value]}</option>
              ))}
            </Select>
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/pedidos')}>Cancelar</Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Salvar alterações' : 'Criar pedido'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
