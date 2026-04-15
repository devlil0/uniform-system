import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { UniformeResponse } from '@/types/api';
import { useUniformes, useDeleteUniforme } from './hooks';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { rotulosRefletivo } from '@/lib/rotulos';

export function UniformeListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useUniformes();
  const deleteMutation = useDeleteUniforme();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns: ColumnDef<UniformeResponse, unknown>[] = [
    { accessorKey: 'id',     header: 'ID',    size: 80 },
    { accessorKey: 'nome',   header: 'Nome' },
    { accessorKey: 'malha',  header: 'Malha' },
    { accessorKey: 'tamanho',header: 'Tamanho' },
    { accessorKey: 'cor',    header: 'Cor' },
    {
      accessorKey: 'refletivo',
      header: 'Refletivo',
      cell: ({ getValue }) => {
        const v = getValue() as UniformeResponse['refletivo'];
        return (
          <Badge variant={v === 'COM_REFLETIVO' ? 'info' : 'default'}>
            {rotulosRefletivo[v]}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/uniformes/${row.original.id}/editar`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setDeleteId(row.original.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <FullPageSpinner />;

  return (
    <>
      <PageHeader
        title="Uniformes"
        subtitle={`${data?.length ?? 0} uniformes cadastrados`}
        action={
          <Button onClick={() => navigate('/uniformes/novo')}>
            <Plus className="h-4 w-4" /> Novo Uniforme
          </Button>
        }
      />
      <DataTable data={data ?? []} columns={columns} searchPlaceholder="Buscar uniforme..." />

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir uniforme"
        description="Tem certeza que deseja excluir este uniforme?"
        confirmLabel="Excluir"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteId !== null) {
            deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
