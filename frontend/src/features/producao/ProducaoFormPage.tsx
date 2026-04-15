import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { producaoSchema } from './schema';
import { useCreateProducao, useProducao, useUpdateProducao } from './hooks';
import { useEnums } from '@/features/enums/hooks';
import { usePedidos } from '@/features/pedido/hooks';
import { useCostureiras } from '@/features/costureira/hooks';
import { FormField } from '@/components/FormField';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { rotulosEtapaProducao } from '@/lib/rotulos';
import { ProducaoRequest } from '@/types/api';

function toDateTimeLocal(value?: string) {
  if (!value) return '';
  return value.slice(0, 16);
}

export function ProducaoFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const numericId = id ? Number(id) : 0;
  const pedidoIdFromQuery = searchParams.get('pedidoId');
  const { data: existing, isLoading } = useProducao(numericId);
  const { data: pedidos } = usePedidos();
  const { data: costureiras } = useCostureiras();
  const { data: enums } = useEnums();
  const createMutation = useCreateProducao();
  const updateMutation = useUpdateProducao(numericId);
  const mutation = isEdit ? updateMutation : createMutation;
  const returnTo = pedidoIdFromQuery ? `/pedidos/${pedidoIdFromQuery}` : '/producoes';

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(producaoSchema),
    defaultValues: {
      pedidoId: pedidoIdFromQuery ? Number(pedidoIdFromQuery) : undefined,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        pedidoId: existing.pedidoResponse.id,
        costureiraId: existing.costureiraResponse.id,
        etapa: existing.etapa,
        entrada: toDateTimeLocal(existing.entrada),
        saida: toDateTimeLocal(existing.saida),
      });
    }
  }, [existing, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    mutation.mutate(values as unknown as ProducaoRequest, { onSuccess: () => navigate(returnTo) });
  };

  if (isEdit && isLoading) return <FullPageSpinner />;

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Produção' : 'Nova Produção'} />
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Pedido" required error={errors.pedidoId?.message as string}>
            <Select {...register('pedidoId')}>
              <option value="">Selecione um pedido...</option>
              {pedidos?.map((p) => <option key={p.id} value={p.id}>#{p.id} — {p.clienteResponse.nome}</option>)}
            </Select>
          </FormField>
          <FormField label="Costureira" required error={errors.costureiraId?.message as string}>
            <Select {...register('costureiraId')}>
              <option value="">Selecione uma costureira...</option>
              {costureiras?.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
          </FormField>
          <FormField label="Etapa" required error={errors.etapa?.message as string}>
            <Select {...register('etapa')}>
              <option value="">Selecione uma etapa...</option>
              {enums?.etapaProducao.map((value) => (
                <option key={value} value={value}>{rotulosEtapaProducao[value]}</option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Data de entrada" error={errors.entrada?.message as string}>
              <Input type="datetime-local" {...register('entrada')} />
            </FormField>
            <FormField label="Data de saída" error={errors.saida?.message as string}>
              <Input type="datetime-local" {...register('saida')} />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(returnTo)}>Cancelar</Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Salvar alterações' : 'Registrar produção'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
