import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { usePedido } from './hooks';
import { useItensPedido, useCreateItemPedido, useDeleteItemPedido } from '@/features/item-pedido/hooks';
import { useProducoes } from '@/features/producao/hooks';
import { useFardos } from '@/features/fardo/hooks';
import { useUniformes } from '@/features/uniforme/hooks';
import { itemPedidoSchema, ItemPedidoFormValues } from '@/features/item-pedido/schema';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/FormField';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { rotulosStatusPedido, rotulosEtapaProducao } from '@/lib/rotulos';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusVariant = {
  EM_PRODUCAO: 'warning',
  FINALIZADO: 'success',
  ENVIADO: 'info',
} as const;

export function PedidoDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const pedidoId = Number(id);

  const { data: pedido, isLoading } = usePedido(pedidoId);
  const { data: todosItens } = useItensPedido();
  const { data: todasProducoes } = useProducoes();
  const { data: todosFardos } = useFardos();
  const { data: uniformes } = useUniformes();

  const itens = todosItens?.filter((i) => i.pedidoResponse.id === pedidoId) ?? [];
  const producoes = todasProducoes?.filter((p) => p.pedidoResponse.id === pedidoId) ?? [];
  const fardo = todosFardos?.find((f) => f.pedidoResponse.id === pedidoId);

  const createItemMutation = useCreateItemPedido();
  const deleteItemMutation = useDeleteItemPedido();
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const shouldStartWithItemForm = location.pathname.endsWith('/itens/novo');
  const [showItemForm, setShowItemForm] = useState(shouldStartWithItemForm);

  useEffect(() => {
    setShowItemForm(shouldStartWithItemForm);
  }, [shouldStartWithItemForm]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemPedidoSchema),
    defaultValues: { pedidoId },
  });

  const onAddItem = (values: Record<string, unknown>) => {
    createItemMutation.mutate(values as unknown as ItemPedidoFormValues, {
      onSuccess: () => {
        setShowItemForm(false);
        reset({ pedidoId });
        navigate(`/pedidos/${pedidoId}`);
      },
    });
  };

  if (isLoading) return <FullPageSpinner />;
  if (!pedido) return <p className="text-gray-500">Pedido não encontrado.</p>;

  const formatDate = (d: string) => {
    try { return format(new Date(d), 'dd/MM/yyyy HH:mm', { locale: ptBR }); } catch { return d; }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button onClick={() => navigate('/pedidos')} className="mb-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-3 w-3" /> Pedidos
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Pedido #{pedido.id}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant[pedido.status]}>{rotulosStatusPedido[pedido.status]}</Badge>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/pedidos/${pedidoId}/editar`)}>
            <Pencil className="h-4 w-4" /> Editar
          </Button>
        </div>
      </div>

      {/* Info card */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <dl className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Cliente</dt>
            <dd className="font-medium text-gray-900">{pedido.clienteResponse.nome}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Data de criação</dt>
            <dd className="font-medium text-gray-900">{formatDate(pedido.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Contato</dt>
            <dd className="font-medium text-gray-900">{pedido.clienteResponse.contato}</dd>
          </div>
        </dl>
      </div>

      {/* Itens do pedido */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Itens do pedido</h2>
          <Button size="sm" onClick={() => setShowItemForm((v) => !v)}>
            <Plus className="h-4 w-4" /> Adicionar item
          </Button>
        </div>

        {showItemForm && (
          <form onSubmit={handleSubmit(onAddItem)} className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <input type="hidden" {...register('pedidoId')} value={pedidoId} />
            <div className="flex items-end gap-3">
              <FormField label="Uniforme" required error={errors.uniformeId?.message} className="flex-1">
                <Select {...register('uniformeId')}>
                  <option value="">Selecione...</option>
                  {uniformes?.map((u) => (
                    <option key={u.id} value={u.id}>{u.nome} — {u.tamanho} / {u.cor}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Qtd." required error={errors.quantidade?.message} className="w-24">
                <Input type="number" min={1} {...register('quantidade')} placeholder="1" />
              </FormField>
              <Button type="submit" loading={createItemMutation.isPending}>Adicionar</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowItemForm(false);
                  if (shouldStartWithItemForm) {
                    navigate(`/pedidos/${pedidoId}`);
                  }
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Uniforme</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tamanho</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Cor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Qtd.</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {itens.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">Nenhum item adicionado.</td></tr>
              ) : itens.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.uniformeResponse.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{item.uniformeResponse.tamanho}</td>
                  <td className="px-4 py-3 text-gray-600">{item.uniformeResponse.cor}</td>
                  <td className="px-4 py-3 text-gray-600">{item.quantidade}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => setDeleteItemId(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Produções */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Produção</h2>
          <Button size="sm" onClick={() => navigate(`/producoes/nova?pedidoId=${pedidoId}`)}>
            <Plus className="h-4 w-4" /> Registrar produção
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Etapa</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Costureira</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Entrada</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Saída</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {producoes.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">Nenhuma produção registrada.</td></tr>
              ) : producoes.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{rotulosEtapaProducao[p.etapa]}</td>
                  <td className="px-4 py-3 text-gray-600">{p.costureiraResponse.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{p.entrada ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.saida ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Fardo */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Fardo</h2>
          {!fardo ? (
            <Button size="sm" onClick={() => navigate(`/fardos/novo?pedidoId=${pedidoId}`)}>
              <Plus className="h-4 w-4" /> Gerar fardo
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => navigate(`/fardos/${fardo.id}/editar?pedidoId=${pedidoId}`)}>
              <Pencil className="h-4 w-4" /> Editar fardo
            </Button>
          )}
        </div>
        {fardo ? (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <dl className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Entregador</dt>
                <dd className="font-medium text-gray-900">{fardo.entregadorResponse.nome}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Data de envio</dt>
                <dd className="font-medium text-gray-900">{fardo.dataEnvio}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Fardo ID</dt>
                <dd className="font-medium text-gray-900">#{fardo.id}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-400 text-center">
            Nenhum fardo gerado para este pedido.
          </p>
        )}
      </section>

      <ConfirmDialog
        open={deleteItemId !== null}
        title="Remover item"
        description="Tem certeza que deseja remover este item do pedido?"
        confirmLabel="Remover"
        loading={deleteItemMutation.isPending}
        onConfirm={() => {
          if (deleteItemId !== null) {
            deleteItemMutation.mutate(deleteItemId, { onSuccess: () => setDeleteItemId(null) });
          }
        }}
        onCancel={() => setDeleteItemId(null)}
      />
    </div>
  );
}
