import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fardoSchema } from './schema';
import { useCreateFardo, useFardo, useUpdateFardo } from './hooks';
import { usePedidos } from '@/features/pedido/hooks';
import { useEntregadores } from '@/features/entregador/hooks';
import { FormField } from '@/components/FormField';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { FardoRequest } from '@/types/api';

export function FardoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const numericId = id ? Number(id) : 0;
  const pedidoIdFromQuery = searchParams.get('pedidoId');

  const { data: existing, isLoading } = useFardo(numericId);
  const { data: pedidos } = usePedidos();
  const { data: entregadores } = useEntregadores();
  const createMutation = useCreateFardo();
  const updateMutation = useUpdateFardo(numericId);
  const mutation = isEdit ? updateMutation : createMutation;
  const returnTo = pedidoIdFromQuery ? `/pedidos/${pedidoIdFromQuery}` : '/fardos';

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(fardoSchema),
    defaultValues: { pedidoId: pedidoIdFromQuery ? Number(pedidoIdFromQuery) : undefined },
  });

  useEffect(() => {
    if (existing) {
      reset({
        pedidoId: existing.pedidoResponse.id,
        entregadorId: existing.entregadorResponse.id,
        dataEnvio: existing.dataEnvio,
      });
    }
  }, [existing, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    mutation.mutate(values as unknown as FardoRequest, {
      onSuccess: () => navigate(returnTo),
    });
  };

  if (isEdit && isLoading) return <FullPageSpinner />;

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Fardo' : 'Novo Fardo'} />
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Pedido" required error={errors.pedidoId?.message as string}>
            <Select {...register('pedidoId')}>
              <option value="">Selecione um pedido...</option>
              {pedidos?.map((p) => <option key={p.id} value={p.id}>#{p.id} — {p.clienteResponse.nome}</option>)}
            </Select>
          </FormField>
          <FormField label="Entregador" required error={errors.entregadorId?.message as string}>
            <Select {...register('entregadorId')}>
              <option value="">Selecione um entregador...</option>
              {entregadores?.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </Select>
          </FormField>
          <FormField label="Data de envio" required error={errors.dataEnvio?.message as string}>
            <Input type="date" {...register('dataEnvio')} />
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(returnTo)}>Cancelar</Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Salvar alterações' : 'Criar fardo'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
