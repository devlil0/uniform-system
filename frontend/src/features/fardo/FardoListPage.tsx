import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { FardoResponse } from '@/types/api';
import { useFardos, useDeleteFardo } from './hooks';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';

export function FardoListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useFardos();
  const deleteMutation = useDeleteFardo();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns: ColumnDef<FardoResponse, unknown>[] = [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { id: 'pedido',      header: 'Pedido',      accessorFn: (row) => `#${row.pedidoResponse.id} — ${row.pedidoResponse.clienteResponse.nome}` },
    { id: 'entregador',  header: 'Entregador',  accessorFn: (row) => row.entregadorResponse.nome },
    { accessorKey: 'dataEnvio', header: 'Data de envio' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/fardos/${row.original.id}/editar`)}>
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
        title="Fardos"
        subtitle={`${data?.length ?? 0} fardos registrados`}
        action={
          <Button onClick={() => navigate('/fardos/novo')}>
            <Plus className="h-4 w-4" /> Novo Fardo
          </Button>
        }
      />
      <DataTable data={data ?? []} columns={columns} searchPlaceholder="Buscar fardo..." />

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir fardo"
        description="Tem certeza que deseja excluir este fardo?"
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
