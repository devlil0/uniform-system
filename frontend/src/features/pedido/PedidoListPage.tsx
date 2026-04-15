import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2, Plus } from 'lucide-react';
import { PedidoResponse } from '@/types/api';
import { usePedidos, useDeletePedido } from './hooks';
import { useItensPedido } from '@/features/item-pedido/hooks';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { rotulosStatusPedido } from '@/lib/rotulos';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusVariant = {
  EM_PRODUCAO: 'warning',
  FINALIZADO: 'success',
  ENVIADO: 'info',
} as const;

export function PedidoListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = usePedidos();
  const { data: itens } = useItensPedido();
  const deleteMutation = useDeletePedido();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const totalItensPorPedido = new Map<number, number>();
  itens?.forEach((item) => {
    totalItensPorPedido.set(
      item.pedidoResponse.id,
      (totalItensPorPedido.get(item.pedidoResponse.id) ?? 0) + item.quantidade,
    );
  });

  const columns: ColumnDef<PedidoResponse, unknown>[] = [
    { accessorKey: 'id', header: 'ID', size: 80 },
    {
      id: 'cliente',
      header: 'Cliente',
      accessorFn: (row) => row.clienteResponse.nome,
    },
    {
      accessorKey: 'createdAt',
      header: 'Data',
      cell: ({ getValue }) => {
        const v = getValue() as string;
        try {
          return format(new Date(v), 'dd/MM/yyyy HH:mm', { locale: ptBR });
        } catch {
          return v;
        }
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const v = getValue() as PedidoResponse['status'];
        return <Badge variant={statusVariant[v]}>{rotulosStatusPedido[v]}</Badge>;
      },
    },
    {
      id: 'totalItens',
      header: 'Total de itens',
      accessorFn: (row) => totalItensPorPedido.get(row.id) ?? 0,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/pedidos/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
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
        title="Pedidos"
        subtitle={`${data?.length ?? 0} pedidos`}
        action={
          <Button onClick={() => navigate('/pedidos/novo')}>
            <Plus className="h-4 w-4" /> Novo Pedido
          </Button>
        }
      />
      <DataTable data={data ?? []} columns={columns} searchPlaceholder="Buscar pedido..." />

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir pedido"
        description="Tem certeza que deseja excluir este pedido?"
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
