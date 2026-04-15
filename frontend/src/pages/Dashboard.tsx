import { useNavigate } from 'react-router-dom';
import { Users, Scissors, Truck, Shirt, ClipboardList, Factory, Package, Warehouse } from 'lucide-react';
import { useClientes } from '@/features/cliente/hooks';
import { useCostureiras } from '@/features/costureira/hooks';
import { useEntregadores } from '@/features/entregador/hooks';
import { useUniformes } from '@/features/uniforme/hooks';
import { usePedidos } from '@/features/pedido/hooks';
import { useProducoes } from '@/features/producao/hooks';
import { useFardos } from '@/features/fardo/hooks';
import { useEstoque } from '@/features/estoque/hooks';
import { Badge } from '@/components/ui/Badge';
import { rotulosStatusPedido, rotulosEtapaProducao } from '@/lib/rotulos';
import { StatusPedido, EtapaProducao } from '@/types/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusVariant = { EM_PRODUCAO: 'warning', FINALIZADO: 'success', ENVIADO: 'info' } as const;

const STAT_ITEMS = [
  { key: 'clientes',     label: 'Clientes',     icon: Users,         to: '/clientes' },
  { key: 'costureiras',  label: 'Costureiras',  icon: Scissors,      to: '/costureiras' },
  { key: 'entregadores', label: 'Entregadores', icon: Truck,         to: '/entregadores' },
  { key: 'uniformes',    label: 'Uniformes',    icon: Shirt,         to: '/uniformes' },
  { key: 'pedidos',      label: 'Pedidos',      icon: ClipboardList, to: '/pedidos' },
  { key: 'producoes',    label: 'Produções',    icon: Factory,       to: '/producoes' },
  { key: 'fardos',       label: 'Fardos',       icon: Package,       to: '/fardos' },
  { key: 'estoque',      label: 'Estoque',      icon: Warehouse,     to: '/estoque' },
];

function StatCard({ label, value, icon: Icon, onClick }: {
  label: string; value: number | undefined;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-4 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1"
      style={{ border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-card)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.10)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'; }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="mt-2 text-[30px] font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
            {value ?? <span className="text-gray-300">—</span>}
          </p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: 'var(--accent-soft)' }}
        >
          <Icon className="h-[20px] w-[20px] transition-colors duration-200" style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </button>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { data: clientes }     = useClientes();
  const { data: costureiras }  = useCostureiras();
  const { data: entregadores } = useEntregadores();
  const { data: uniformes }    = useUniformes();
  const { data: pedidos }      = usePedidos();
  const { data: producoes }    = useProducoes();
  const { data: fardos }       = useFardos();
  const { data: estoque }      = useEstoque();

  const counts: Record<string, number | undefined> = {
    clientes: clientes?.length, costureiras: costureiras?.length,
    entregadores: entregadores?.length, uniformes: uniformes?.length,
    pedidos: pedidos?.length, producoes: producoes?.length,
    fardos: fardos?.length, estoque: estoque?.length,
  };

  const pedidosPorStatus: Partial<Record<StatusPedido, number>> = {};
  pedidos?.forEach((p) => { pedidosPorStatus[p.status] = (pedidosPorStatus[p.status] ?? 0) + 1; });

  const producoesPorEtapa: Partial<Record<EtapaProducao, number>> = {};
  producoes?.forEach((p) => { producoesPorEtapa[p.etapa] = (producoesPorEtapa[p.etapa] ?? 0) + 1; });

  const ultimosPedidos = [...(pedidos ?? [])].reverse().slice(0, 5);

  const cardStyle = { border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-card)', background: 'var(--bg-surface)' };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Bem-vindo ao sistema de gestão UI Uniformes</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_ITEMS.map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            value={counts[item.key]}
            onClick={() => navigate(item.to)}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Pedidos por status */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[22px] font-semibold" style={{ color: 'var(--text-main)' }}>Pedidos por status</h2>
            <button
              onClick={() => navigate('/pedidos')}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}
            >
              Ver todos →
            </button>
          </div>
          <div className="space-y-4">
            {(Object.keys(rotulosStatusPedido) as StatusPedido[]).map((s) => {
              const count = pedidosPorStatus[s] ?? 0;
              const total = pedidos?.length || 1;
              const pct = Math.round((count / total) * 100);
              const barColor = s === 'EM_PRODUCAO' ? '#fbbf24' : s === 'FINALIZADO' ? '#22c55e' : '#6366f1';
              return (
                <div key={s} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant={statusVariant[s]}>{rotulosStatusPedido[s]}</Badge>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Produção por etapa */}
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[22px] font-semibold" style={{ color: 'var(--text-main)' }}>Produção por etapa</h2>
            <button
              onClick={() => navigate('/producoes')}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}
            >
              Ver todos →
            </button>
          </div>
          <div className="space-y-0">
            {(Object.keys(rotulosEtapaProducao) as EtapaProducao[]).map((e) => {
              const count = producoesPorEtapa[e] ?? 0;
              const total = producoes?.length || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={e} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid #eee' }}>
                  <span className="w-28 shrink-0 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{rotulosEtapaProducao[e]}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: '#f3f4f6' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Últimos pedidos */}
      <div className="overflow-hidden rounded-2xl" style={cardStyle}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <h2 className="text-[22px] font-semibold" style={{ color: 'var(--text-main)' }}>Últimos pedidos</h2>
          <button
            onClick={() => navigate('/pedidos')}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style={{ color: 'var(--accent)', background: 'var(--accent-soft)' }}
          >
            Ver todos →
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #f9fafb', background: '#fafafa' }}>
              {['Pedido', 'Cliente', 'Data', 'Status'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ultimosPedidos.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text-faint)' }}>Nenhum pedido.</td></tr>
            ) : ultimosPedidos.map((p) => (
              <tr
                key={p.id}
                onClick={() => navigate(`/pedidos/${p.id}`)}
                className="cursor-pointer transition-colors"
                style={{ borderBottom: '1px solid #f9fafb' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-5 py-3.5 font-semibold" style={{ color: 'var(--text-main)' }}>#{p.id}</td>
                <td className="px-5 py-3.5" style={{ color: 'var(--text-main)' }}>{p.clienteResponse.nome}</td>
                <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {(() => { try { return format(new Date(p.createdAt), 'dd/MM/yyyy', { locale: ptBR }); } catch { return p.createdAt; } })()}
                </td>
                <td className="px-5 py-3.5"><Badge variant={statusVariant[p.status]}>{rotulosStatusPedido[p.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
