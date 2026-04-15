import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { EntregadorResponse } from '@/types/api';
import { useEntregadores, useDeleteEntregador } from './hooks';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';

export function EntregadorListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useEntregadores();
  const deleteMutation = useDeleteEntregador();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns: ColumnDef<EntregadorResponse, unknown>[] = [
    { accessorKey: 'id',       header: 'ID',       size: 80 },
    { accessorKey: 'nome',     header: 'Nome' },
    { accessorKey: 'telefone', header: 'Telefone' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/entregadores/${row.original.id}/editar`)}>
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
        title="Entregadores"
        subtitle={`${data?.length ?? 0} entregadores cadastrados`}
        action={
          <Button onClick={() => navigate('/entregadores/novo')}>
            <Plus className="h-4 w-4" /> Novo Entregador
          </Button>
        }
      />
      <DataTable data={data ?? []} columns={columns} searchPlaceholder="Buscar entregador..." />

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir entregador"
        description="Tem certeza que deseja excluir este entregador?"
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
