import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uniformeSchema } from './schema';
import { useUniforme, useCreateUniforme, useUpdateUniforme } from './hooks';
import { useEnums } from '@/features/enums/hooks';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { rotulosRefletivo } from '@/lib/rotulos';
import { UniformeRequest } from '@/types/api';

export function UniformeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const numericId = id ? Number(id) : 0;

  const { data: existing, isLoading } = useUniforme(numericId);
  const { data: enums } = useEnums();
  const createMutation = useCreateUniforme();
  const updateMutation = useUpdateUniforme(numericId);
  const mutation = isEdit ? updateMutation : createMutation;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(uniformeSchema),
  });

  useEffect(() => {
    if (existing) reset(existing);
  }, [existing, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    mutation.mutate(values as unknown as UniformeRequest, { onSuccess: () => navigate('/uniformes') });
  };

  if (isEdit && isLoading) return <FullPageSpinner />;

  return (
    <>
      <PageHeader title={isEdit ? 'Editar Uniforme' : 'Novo Uniforme'} />
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nome" required error={errors.nome?.message as string}>
            <Input {...register('nome')} placeholder="Ex.: Camiseta Polo" />
          </FormField>
          <FormField label="Malha" required error={errors.malha?.message as string}>
            <Input {...register('malha')} placeholder="Ex.: PV, Algodão" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tamanho" required error={errors.tamanho?.message as string}>
              <Select {...register('tamanho')}>
                <option value="">Selecione...</option>
                {enums?.tamanho.map((tamanho) => <option key={tamanho} value={tamanho}>{tamanho}</option>)}
              </Select>
            </FormField>
            <FormField label="Cor" required error={errors.cor?.message as string}>
              <Input {...register('cor')} placeholder="Ex.: Azul marinho" />
            </FormField>
          </div>
          <FormField label="Refletivo" required error={errors.refletivo?.message as string}>
            <Select {...register('refletivo')}>
              <option value="">Selecione...</option>
              {enums?.refletivo.map((value) => (
                <option key={value} value={value}>{rotulosRefletivo[value]}</option>
              ))}
            </Select>
          </FormField>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/uniformes')}>Cancelar</Button>
            <Button type="submit" loading={mutation.isPending}>
              {isEdit ? 'Salvar alterações' : 'Criar uniforme'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
