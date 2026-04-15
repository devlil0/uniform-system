import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Scissors, Truck, Shirt,
  ClipboardList, Factory, Package, Warehouse,
  ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, Bell, Moon, Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { useEnums } from '@/features/enums/hooks';
import type { NotFoundNavigationDetail } from '@/lib/api-client';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}
interface NavGroup { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: 'Visão geral',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Cadastros',
    items: [
      { to: '/clientes',     label: 'Clientes',     icon: Users },
      { to: '/costureiras',  label: 'Costureiras',  icon: Scissors },
      { to: '/entregadores', label: 'Entregadores', icon: Truck },
      { to: '/uniformes',    label: 'Uniformes',    icon: Shirt },
    ],
  },
  {
    label: 'Operações',
    items: [
      { to: '/pedidos',   label: 'Pedidos',   icon: ClipboardList },
      { to: '/producoes', label: 'Produções', icon: Factory },
      { to: '/fardos',    label: 'Fardos',    icon: Package },
      { to: '/estoque',   label: 'Estoque',   icon: Warehouse },
    ],
  },
];

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const map: Record<string, string> = {
    clientes: 'Clientes', costureiras: 'Costureiras', entregadores: 'Entregadores',
    uniformes: 'Uniformes', pedidos: 'Pedidos', producoes: 'Produções',
    fardos: 'Fardos', estoque: 'Estoque', novo: 'Novo', nova: 'Nova', editar: 'Editar',
  };
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return ['Dashboard'];
  return parts.map((s) => isNaN(Number(s)) ? (map[s] ?? s.charAt(0).toUpperCase() + s.slice(1)) : `#${s}`);
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const crumbs = useBreadcrumbs();
  const navigate = useNavigate();
  useEnums();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('ui-uniformes-theme');
    const nextIsDark = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(nextIsDark);
  }, []);

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('ui-uniformes-theme', theme);
  }, [isDark]);

  useEffect(() => {
    const resourceToRoute: Record<string, string> = {
      cliente: '/clientes',
      costureira: '/costureiras',
      entregador: '/entregadores',
      uniforme: '/uniformes',
      pedido: '/pedidos',
      'item-pedido': '/pedidos',
      producao: '/producoes',
      fardo: '/fardos',
      estoque: '/estoque',
    };

    const handleNotFound = (event: Event) => {
      const detail = (event as CustomEvent<NotFoundNavigationDetail>).detail;
      const match = detail.resourcePath.match(/\/api\/([^/?]+)/);
      const feature = match?.[1];

      if (feature && resourceToRoute[feature]) {
        navigate(resourceToRoute[feature]);
      }
    };

    window.addEventListener('app:not-found', handleNotFound);
    return () => window.removeEventListener('app:not-found', handleNotFound);
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'transparent' }}>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex h-screen flex-col transition-all duration-200 lg:relative lg:inset-auto lg:z-auto lg:h-auto lg:translate-x-0 lg:shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          sidebarOpen ? 'w-60' : 'w-60 lg:w-[88px]',
        )}
        style={{
          background: '#0f172a',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 30px rgba(2, 6, 23, 0.22)',
        }}
      >
        {/* Logo area */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          {(sidebarOpen || typeof window === 'undefined') && (
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <div className="leading-none">
                <p className="text-sm font-bold text-white">UI Uniformes</p>
                <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#64748b' }}>Gestão</p>
              </div>
            </div>
          )}
          {!sidebarOpen && <Logo size={28} className="mx-auto hidden lg:block" />}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-2 py-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {sidebarOpen && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>
                  {group.label}
                </p>
              )}
              <ul className="space-y-2">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      title={!sidebarOpen ? label : undefined}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
                          !sidebarOpen && 'lg:justify-center lg:px-2',
                          isActive
                            ? 'text-white'
                            : 'hover:text-white',
                        )
                      }
                      style={({ isActive }) => ({
                        background: isActive ? '#1e293b' : 'transparent',
                        color: isActive ? '#fff' : '#94a3b8',
                        boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
                      })}
                      onMouseEnter={(e) => {
                        if (!(e.currentTarget as HTMLElement).getAttribute('aria-current')) {
                          (e.currentTarget as HTMLElement).style.background = '#1e293b';
                          (e.currentTarget as HTMLElement).style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!(e.currentTarget as HTMLElement).getAttribute('aria-current')) {
                          const isActive = e.currentTarget.getAttribute('data-active') === 'true';
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                          }
                        }
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-indigo-400' : '')} />
                          <span className={cn(!sidebarOpen && 'lg:hidden')}>{label}</span>
                          {sidebarOpen && isActive && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <p className="text-xs" style={{ color: '#475569' }}>© 2026 UI Uniformes</p>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6"
          style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="hidden rounded-lg p-1.5 transition-colors hover:bg-gray-100 lg:block"
              style={{ color: 'var(--text-muted)' }}
            >
              {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 lg:hidden"
              style={{ color: 'var(--text-muted)' }}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-sm">
              <span style={{ color: 'var(--text-faint)' }}>UI Uniformes</span>
              {crumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: 'var(--text-faint)' }} />
                  <span style={{ color: i === crumbs.length - 1 ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: i === crumbs.length - 1 ? 600 : 400 }}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDark((value) => !value)}
              className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <button className="relative rounded-lg p-2 transition-colors hover:bg-gray-100" style={{ color: 'var(--text-muted)' }}>
              <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            </button>
            <div className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
              style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-panel)' }}>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">G</span>
              <span className="hidden text-sm font-semibold sm:block" style={{ color: 'var(--text-main)' }}>Gestor</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
