import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { EtapaProducao, ProducaoResponse } from '@/types/api';
import { useProducoes, useDeleteProducao } from './hooks';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageHeader } from '@/components/PageHeader';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { rotulosEtapaProducao } from '@/lib/rotulos';

const etapaVariant: Record<string, 'default' | 'warning' | 'info' | 'success'> = {
  CORTE:      'default',
  COSTURA:    'warning',
  ACABAMENTO: 'info',
  ESTAMPA:    'info',
  EMBALAGEM:  'warning',
  DESPACHADO: 'success',
};

export function ProducaoListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useProducoes();
  const deleteMutation = useDeleteProducao();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const etapas = Object.keys(rotulosEtapaProducao) as EtapaProducao[];
  const agrupadoPorEtapa = etapas.map((etapa) => ({
    etapa,
    items: (data ?? []).filter((item) => item.etapa === etapa),
  }));

  const columns: ColumnDef<ProducaoResponse, unknown>[] = [
    { accessorKey: 'id', header: 'ID', size: 80 },
    { id: 'pedido', header: 'Pedido', accessorFn: (row) => `#${row.pedidoResponse.id} — ${row.pedidoResponse.clienteResponse.nome}` },
    { id: 'costureira', header: 'Costureira', accessorFn: (row) => row.costureiraResponse.nome },
    {
      accessorKey: 'etapa',
      header: 'Etapa',
      cell: ({ getValue }) => {
        const v = getValue() as ProducaoResponse['etapa'];
        return <Badge variant={etapaVariant[v]}>{rotulosEtapaProducao[v]}</Badge>;
      },
    },
    { accessorKey: 'entrada', header: 'Entrada', cell: ({ getValue }) => (getValue() as string) ?? '—' },
    { accessorKey: 'saida',   header: 'Saída',   cell: ({ getValue }) => (getValue() as string) ?? '—' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/producoes/${row.original.id}/editar`)}>
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
        title="Produções"
        subtitle={`${data?.length ?? 0} registros de produção`}
        action={
          <Button onClick={() => navigate('/producoes/nova')}>
            <Plus className="h-4 w-4" /> Nova Produção
          </Button>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {agrupadoPorEtapa.map(({ etapa, items }) => (
          <section key={etapa} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Badge variant={etapaVariant[etapa]}>{rotulosEtapaProducao[etapa]}</Badge>
              <span className="text-xs font-semibold text-gray-500">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-400">
                  Nenhum pedido nesta etapa.
                </p>
              ) : items.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(`/pedidos/${item.pedidoResponse.id}`)}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                >
                  <p className="text-sm font-semibold text-gray-900">Pedido #{item.pedidoResponse.id}</p>
                  <p className="text-xs text-gray-600">{item.pedidoResponse.clienteResponse.nome}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.costureiraResponse.nome}</p>
                </button>
              ))}
              {items.length > 4 && (
                <p className="text-center text-xs text-gray-400">+ {items.length - 4} registro(s)</p>
              )}
            </div>
          </section>
        ))}
      </div>
      <DataTable data={data ?? []} columns={columns} searchPlaceholder="Buscar produção..." />

      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir produção"
        description="Tem certeza que deseja excluir este registro de produção?"
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
