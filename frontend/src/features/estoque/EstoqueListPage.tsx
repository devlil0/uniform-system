import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { EstoqueResponse } from '@/types/api';
import { useEstoque, useDeleteEstoque } from './hooks';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';

export function EstoqueListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useEstoque();
  const deleteMutation = useDeleteEstoque();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns: ColumnDef<EstoqueResponse, unknown>[] = [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { id: 'uniforme', header: 'Uniforme', accessorFn: (row) => row.uniformeResponse.nome },
    { id: 'tamanho',  header: 'Tamanho', accessorFn: (row) => row.uniformeResponse.tamanho },
    { accessorKey: 'quantidade', header: 'Quantidade' },
    {
      id: 'vinculado',
      header: 'Vinculado a cliente',
      // ⚠️ typo do backend: vinciuladoCliente
      cell: ({ row }) => (
        <Badge variant={row.original.vinciuladoCliente ? 'info' : 'default'}>
          {row.original.vinciuladoCliente ? 'Sim' : 'Não'}
        </Badge>
      ),
    },
    {
      id: 'cliente',
      header: 'Cliente',
      accessorFn: (row) => row.clienteResponse?.nome ?? '—',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/estoque/${row.original.id}/editar`)}>
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
        title="Estoque"
        subtitle={`${data?.length ?? 0} itens em estoque`}
        action={
          <Button onClick={() => navigate('/estoque/novo')}>
            <Plus className="h-4 w-4" /> Novo Item
          </Button>
        }
      />
      <DataTable data={data ?? []} columns={columns} searchPlaceholder="Buscar estoque..." />

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir item do estoque"
        description="Tem certeza que deseja excluir este item do estoque?"
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
