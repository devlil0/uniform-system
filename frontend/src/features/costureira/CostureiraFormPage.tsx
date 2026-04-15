import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { costureiraSchema } from './schema';
import { useCostureira, useCreateCostureira, useUpdateCostureira } from './hooks';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { CostureiraRequest } from '@/types/api';

export function CostureiraFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const numericId = id ? Number(id) : 0;

  const { data: existing, isLoading } = useCostureira(numericId);
  const createMutation = useCreateCostureira();
  const updateMutation = useUpdateCostureira(numericId);
  const mutation = isEdit ? updateMutation : createMutation;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(costureiraSchema),
  });

  useEffect(() => {
    if (existing) reset(existing);
  }, [existing, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    mutation.mutate(values as unknown as CostureiraRequest, { onSuccess: () => navigate('/costureiras') });
  };

  if (isEdit && isLoading) return <FullPageSpinner />;

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Costureira' : 'Nova Costureira'} />
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isEdit && (
            <FormField label="ID" required error={errors.id?.message as string}>
              <Input type="number" {...register('id')} placeholder="Ex.: 1" />
            </FormField>
          )}
          <FormField label="Nome" required error={errors.nome?.message as string}>
            <Input {...register('nome')} placeholder="Nome da costureira" />
          </FormField>
          <FormField label="Telefone" required error={errors.telefone?.message as string}>
            <Input {...register('telefone')} placeholder="(00) 00000-0000" />
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/costureiras')}>Cancelar</Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Salvar alterações' : 'Criar costureira'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
